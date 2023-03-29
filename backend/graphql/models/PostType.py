from django.db import models

class PostModel(models.Model):
    content = models.TextField()
    area = models.IntegerField()
    like = models.IntegerField()
    create_time = models.DateField()
    account = models.CharField(max_length=30)
    post_id = models.IntegerField()

    class Meta:
        ordering = ['create_time']
    def __str__(self) -> str:
        return self.account