# Generated by Django 3.1.7 on 2021-03-24 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oddam_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='institution',
            name='type',
            field=models.CharField(choices=[('fundacja', 'fundacja'), ('organizacja pozarządowa', 'organizacja pozarządowa'), ('zbiórka lokalna', 'zbiórka lokalna')], default=1, max_length=128),
        ),
    ]
