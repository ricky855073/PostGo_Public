import psycopg2
import paramiko
from sshtunnel import SSHTunnelForwarder


def ssh_connect():
    pkey = paramiko.RSAKey.from_private_key_file('../id_rsa')  # Remaining.
    server = SSHTunnelForwarder(
        ('35.234.13.143', 14022),
        ssh_username="hsienmingliu",
        ssh_pkey="../id_rsa",
        remote_bind_address=('10.79.208.3', 5432)
    )
    server.start()
    print("SSH Tunnel Established")

    return server


def graphql_server():
    ssh_tunnel = ssh_connect()
    # Get the local port number
    local_port = ssh_tunnel.local_bind_port

    # Create a Graphene client
    schema = graphene.Schema(query=Query)
    client = Client(schema=schema, middlewares=[HttpMiddleware()])

    return schema


def get_db(server_tunnel, readonly=True):
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=server_tunnel.local_bind_port,
        database="postgres",
        user="hsienmingliu",
        password="PG0v~rZ}y's),cnQ"
    )
    conn.set_session(readonly=readonly)  # read only!
    if readonly:
        print("Read-Only DB connected")
    else:
        print("Read-Write DB connected")

    return conn


def general_insert_update(STRING, cnxn):
    cursor = cnxn.cursor()
    string = f'{STRING}'
    try:
        cursor.execute(string)
        cnxn.commit()
        result = True
    except Exception as e:
        cnxn.rollback()
        print(e)
        result = False

    return result


def general_query(STRING, cnxn):
    cursor = cnxn.cursor()
    cursor.execute(STRING)
    data_list = list()

    try:
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        for row in rows:
            temp_list = list()
            temp_list.append(dict(zip(columns, row)))
            data_list.append(temp_list)
    except Exception as e:
        print(e)
        pass

    cnxn.commit()
    cursor.close() # cursor result close

    # flatten data_list
    data_list = [item for sublist in data_list for item in sublist]

    return data_list


def main():
    server = ssh_connect()
    conn = get_db(server, True)
    conn_write = get_db(server, False)

    # For Query
    query_string = "SELECT * FROM public.login_record;"
    result = general_query(query_string, conn)
    print(result)

    # For Insert
    ins_string = "INSERT INTO public.login_record VALUES('Betty', now(), 'Success', TRUE);"
    general_insert(ins_string, conn_write)
    conn.commit()

    # cursor.execute()
    conn.commit()
    conn.close()
    server.stop()



if __name__ == '__main__':
    main()


