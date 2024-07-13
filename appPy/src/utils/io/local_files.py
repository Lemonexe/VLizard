import os
import shutil

# all file operations in whole project should use these paths as the source of truth
documents_folder = os.path.join(os.environ['USERPROFILE'], 'Documents')
app_folder_path = os.path.join(documents_folder, 'VLizard')
data_folder_path = os.path.join(app_folder_path, 'data')
config_path = os.path.join(app_folder_path, 'config.yaml')

# shorthand to generate path to files in data folder
join_data_path = lambda *args: os.path.join(data_folder_path, *args)


def touch_dir(path):
    """Create a directory if it doesn't exist."""
    if not os.path.exists(path): os.makedirs(path)


def create_user_folders():
    """Create the necessary folders in user's Documents for the app."""
    should_seed = not os.path.exists(app_folder_path)
    touch_dir(app_folder_path)
    touch_dir(data_folder_path)

    touch_dir(join_data_path('VLE'))
    touch_dir(join_data_path('ps'))

    if should_seed:
        # this must match the git-tracked appPy/seed_data folder
        touch_dir(join_data_path('VLE', 'EtOH-H2O'))
        shutil.copy('seed_data/AntoineExt.tsv', join_data_path('ps'))
        shutil.copy('seed_data/Kamihama2012.tsv', join_data_path('VLE', 'EtOH-H2O'))
        shutil.copy('seed_data/Voutsas2011.tsv', join_data_path('VLE', 'EtOH-H2O'))


create_user_folders()
