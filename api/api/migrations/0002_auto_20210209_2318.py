# Generated by Django 3.1 on 2021-02-09 14:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='title',
            new_name='task',
        ),
    ]