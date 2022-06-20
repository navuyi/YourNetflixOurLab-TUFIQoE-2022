from importlib.resources import path
import os
import shutil

BACKEND_DIR_PATH = "./backend"
BUILD_DIR_PATH = "./extension/build"
PACKAGE_PATH = "./software"


def delete_package_directory():
    print("Deleting package directory")
    shutil.rmtree(path=PACKAGE_PATH)


def create_package_directory():
    print("Creating package directory")
    os.makedirs(PACKAGE_PATH)


def fill_package():
    shutil.copytree(BACKEND_DIR_PATH, os.path.join(PACKAGE_PATH, "backend"), dirs_exist_ok=True)
    shutil.copytree(BUILD_DIR_PATH, os.path.join(PACKAGE_PATH, "build"), dirs_exist_ok=True)


def main():
    if os.path.exists(path=PACKAGE_PATH) and os.path.isdir(PACKAGE_PATH):
        delete_package_directory()
        create_package_directory()
        fill_package()
    elif os.path.exists(path=PACKAGE_PATH) == False:
        create_package_directory()
        fill_package()
    print("Done...")


if __name__ == "__main__":
    main()
