from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, password2, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('Email musi być ustawiony'))
        if password != password2:
            raise ValidationError('Hasła nie są takie same')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


TYPES = (
    (1, 'fundacja'),
    (2, 'organizacja pozarządowa'),
    (3, 'zbiórka lokalna'),
)


class Category(models.Model):
    name = models.CharField(max_length=128)


class Institution(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    type = models.CharField(choices=TYPES, default=1, max_length=128)
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
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, default=None)
