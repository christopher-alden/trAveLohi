from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator
import pandas as pd
import os, shutil

class GeoGuesserTest:
    categories = ['Brazil', 'Canada', 'Finland', 'Japan', 'United_States', 'United-Kingdom']
    def __init__(self,test_path, model_path):
        self.model = load_model(model_path)
        self.test_path = test_path

    def preprocess_test(self):
        df = pd.read_csv(os.path.join(self.test_path, "_classes.csv"))
        df.columns = df.columns.str.strip().str.lower()
        df = df[['filename', 'brazil', 'canada', 'finland', 'japan', 'united-kingdom', 'united_states', 'unlabeled']]

        for category in self.categories:
            os.makedirs(os.path.join('test', category), exist_ok=True)

        error_count = 0
        for _, row in df.iterrows():
            try:
                for category in self.categories:
                    if row[category.lower()] == 1:
                        source_path = os.path.join(self.test_path, row['filename'])
                        dest_path = os.path.join('test', category, row['filename'])
                        shutil.copyfile(source_path, dest_path)
                        break
            except Exception as e:
                print(f"Error {row['filename']}: {e}")
                error_count += 1

        self.write_testing_data_summary(error_count)
    
    def write_testing_data_summary(self, error_count):
        with open("test_data.txt", "w") as f:
            for category in self.categories:
                img_list = os.listdir(os.path.join('test', category))
                f.write(f"Images in {category}: {len(img_list)}\n")
            f.write(f"Unreadable Images: {error_count}")

    def test(self, test_data_dir, batch_size=32):
        test_datagen = ImageDataGenerator(rescale=1./255)
        
        test_generator = test_datagen.flow_from_directory(
            test_data_dir,
            target_size=(227, 227),
            batch_size=batch_size,
            class_mode='categorical',
            shuffle=False
        )
        
        evaluation = self.model.evaluate(test_generator)
        
        accuracy = evaluation[1]
        
        return accuracy

testing = GeoGuesserTest('Dataset/test','geoguesser_65.keras')
# testing.preprocess_test()


test_accuracy = testing.test('test', batch_size=24)

print(f'Test Accuracy: {test_accuracy}')
