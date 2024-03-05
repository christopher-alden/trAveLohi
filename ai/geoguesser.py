from ALnet import ALnet
import tensorflow as tf
from tensorflow import keras
from keras.preprocessing import image
import numpy as np
import pandas as pd
import os
import math
import shutil
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import LearningRateScheduler, ReduceLROnPlateau
from keras.models import load_model

class GeoGuesser:
    categories = ['Brazil', 'Canada', 'Finland', 'Japan', 'United_States', 'United-Kingdom']
    def __init__(self, train_path, valid_path, num_classes):
        self.train_path = train_path
        self.valid_path = valid_path
        self.num_classes = num_classes
        self.model = ALnet(num_classes=self.num_classes)
        self.model.build(input_shape=(None, 227, 227, 3))

    #PREPROCESSING
    def preprocess_dataset(self):
        df = pd.read_csv(os.path.join(self.train_path, "_classes.csv"))
        df.columns = df.columns.str.strip().str.lower()
        df = df[['filename', 'brazil', 'canada', 'finland', 'japan', 'united-kingdom', 'united_states', 'unlabeled']]

        for category in self.categories:
            os.makedirs(os.path.join('data', category), exist_ok=True)

        error_count = 0
        for _, row in df.iterrows():
            try:
                for category in self.categories:
                    if row[category.lower()] == 1:
                        source_path = os.path.join(self.train_path, row['filename'])
                        dest_path = os.path.join('data', category, row['filename'])
                        shutil.copyfile(source_path, dest_path)
                        break
            except Exception as e:
                print(f"Error {row['filename']}: {e}")
                error_count += 1

        self.write_training_data_summary(error_count)

    def preprocess_validset(self):
        df = pd.read_csv(os.path.join(self.valid_path, "_classes.csv"))
        df.columns = df.columns.str.strip().str.lower()
        df = df[['filename', 'brazil', 'canada', 'finland', 'japan', 'united-kingdom', 'united_states', 'unlabeled']]

        for category in self.categories:
            os.makedirs(os.path.join('valid', category), exist_ok=True)

        error_count = 0
        for _, row in df.iterrows():
            try:
                for category in self.categories:
                    if row[category.lower()] == 1:
                        source_path = os.path.join(self.valid_path, row['filename'])
                        dest_path = os.path.join('valid', category, row['filename'])
                        shutil.copyfile(source_path, dest_path)
                        break
            except Exception as e:
                print(f"Error {row['filename']}: {e}")
                error_count += 1

        self.write_valid_data_summary(error_count)

    def load_and_preprocess_image_pathbase(self, img_path):
        img = image.load_img(img_path, target_size=(227, 227))

        if image.mode != 'RGB':
            image = image.convert('RGB')

        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0
        return img_array
    
    def preprocess_image(self, image):
        image = image.resize((227, 227))

        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        return img_array

    #PREPROCESSING

    #UTILS
    def step_decay(self, epoch):
            initial_lrate = 0.0001
            drop = 0.5
            epochs_drop = 10.0
            lrate = initial_lrate * math.pow(drop, math.floor((1+epoch)/epochs_drop))
            return lrate

    def write_training_data_summary(self, error_count):
        with open("train_data.txt", "w") as f:
            for category in self.categories:
                img_list = os.listdir(os.path.join('data', category))
                f.write(f"Images in {category}: {len(img_list)}\n")
            f.write(f"Unreadable Images: {error_count}")

    def write_valid_data_summary(self, error_count):
        with open("valid_data.txt", "w") as f:
            for category in self.categories:
                img_list = os.listdir(os.path.join('valid', category))
                f.write(f"Images in {category}: {len(img_list)}\n")
            f.write(f"Unreadable Images: {error_count}")
    #UTILS
            
    def predict_location_pathbase(self, model_path, img_path):
        model = keras.models.load_model(model_path)
        img_array = self.load_and_preprocess_image_pathbase(img_path)
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions, axis=1)
        return predicted_class[0]
    
    def predict_location(self, model_path, img_array):
        model = keras.models.load_model(model_path)
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions, axis=1)
        return predicted_class[0]

    def train(self, batch_size=32, epochs=10):
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True
        )
        test_datagen = ImageDataGenerator(rescale=1./255)

        train_generator = train_datagen.flow_from_directory(
            'data',
            target_size=(227, 227),
            batch_size=batch_size,
            class_mode='categorical',
        )

        valid_generator = test_datagen.flow_from_directory(
            'valid',
            target_size=(227, 227),
            batch_size=batch_size,
            class_mode='categorical',
        )

        optimizer = keras.optimizers.legacy.Adam(learning_rate=0.0001)

        if os.path.exists('geoguesser_65.keras'):
            self.model = load_model('geoguesser_65.keras')
            print("dah load yg duls")

        self.model.compile(
            optimizer=optimizer,
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        # lrate = LearningRateScheduler(self.step_decay)
        lrate = ReduceLROnPlateau(monitor='val_loss', factor=0.15, patience=2, min_lr=0.00001, verbose=1)

        self.model.fit(
            train_generator,
            validation_data=valid_generator,
            validation_steps=len(valid_generator),
            epochs=epochs,
            callbacks=[lrate],
            verbose=1
        )

        self.model.save('geoguesser_65.keras')
        


# geoguesser = GeoGuesser('Dataset/train', 'Dataset/valid', 6)
# geoguesser.preprocess_dataset()
# geoguesser.preprocess_validset()

# geoguesser.train(batch_size=32, epochs=10)

# predicted_class_index = geoguesser.predict_location_pathbase('geoguesser_65.keras', 'data/United_States/canvas_1629401114_jpg.rf.4b04d189ec96ffc30dc86e6345e756e3.jpg')
# print(GeoGuesser.categories[predicted_class_index])