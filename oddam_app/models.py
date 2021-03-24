from django.contrib.auth.models import User
from django.db import models

TYPES = (
    ('fundacja', 'fundacja'),
    ('organizacja pozarządowa', 'organizacja pozarządowa'),
    ('zbiórka lokalna', 'zbiórka lokalna'),
)


class Category(models.Model):
    name = models.CharField(max_length=128)


class Institution(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    type = models.CharField(choices=TYPES, default='fundacja', max_length=128)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.type


class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=128)
    phone_number = models.IntegerField()
    city = models.CharField(max_length=64)
    zip_code = models.CharField(max_length=64)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, default=None)
