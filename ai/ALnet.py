from tensorflow import keras
from keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from keras.initializers import HeNormal
from keras.regularizers import l2



class ALnet(keras.Model):
    def __init__(self, num_classes=1000):
        super(ALnet, self).__init__()
        initializer = HeNormal()
        regularizer = l2(0.0005)

        self.conv1 = Conv2D(filters=96, kernel_size=(11, 11), strides=(4, 4),
                            activation='relu', kernel_initializer=initializer,
                            kernel_regularizer=regularizer)
        self.batchnorm1 = BatchNormalization()
        self.pool1 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))
        self.conv2 = Conv2D(filters=256, kernel_size=(5, 5), activation='relu', kernel_initializer=initializer,
                            kernel_regularizer=regularizer)
        self.pool2 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))
        self.conv3 = Conv2D(filters=384, kernel_size=(3, 3), activation='relu', kernel_initializer=initializer,
                            kernel_regularizer=regularizer)
        self.conv4 = Conv2D(filters=384, kernel_size=(3, 3), activation='relu', kernel_initializer=initializer,
                            kernel_regularizer=regularizer)
        self.conv5 = Conv2D(filters=256, kernel_size=(3, 3), activation='relu', kernel_initializer=initializer,
                            kernel_regularizer=regularizer)
        self.pool5 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))
        self.flatten = Flatten()
        self.fc1 = Dense(4096, activation='relu', kernel_initializer=initializer)
        self.drop1 = Dropout(0.5)
        self.fc2 = Dense(4096, activation='relu', kernel_initializer=initializer)
        self.drop2 = Dropout(0.5)
        self.fc3 = Dense(num_classes, activation='softmax',kernel_initializer=initializer)

    def call(self, inputs):
        x = self.conv1(inputs)
        x = self.batchnorm1(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.pool2(x)
        x = self.conv3(x)
        x = self.conv4(x)
        x = self.conv5(x)
        x = self.pool5(x)
        x = self.flatten(x)
        x = self.fc1(x)
        x = self.drop1(x)
        x = self.fc2(x)
        x = self.drop2(x)
        return self.fc3(x)
