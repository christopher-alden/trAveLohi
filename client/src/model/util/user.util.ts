export enum UserGender{
    Male = "Male",
    Female = "Female",
    DuckCing = "DuckCing"
}
    
export enum SecurityQuestion{
    Q1 = "What is your favorite childhood pet's name?",
    Q2 = "In which city where you born?",
    Q3 = "What is the name of your favorite book or movie?",
    Q4 = "What is the name of the elementary school you attended?",
    Q5 = "What is the model of your first car?"
}

export const AttributeRules ={
    firstName:{
        required:"*Required",
        maxLength:50,
        minLength:5,
        pattern: /^[A-Za-z]+$/i 
    },
    lastName:{
        required:"*Required",
        maxLength:50,
        minLength:5,
        pattern: /^[A-Za-z]+$/i 
    },
    email:{
        required:"*Required",
        maxLength:50,
        minLength:5,
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
    },
    password:{
        required:"*Required",
        maxLength:30,
        minLength:8,
        pattern: {
            value: /^[A-Za-z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/,
            message: 'Anjai'
        }
        , 
    },
    gender: {
        required:"*Required",
    },
    dob: {
        required:"*Required",
    },
    securityQuestion: {
        required:"*Required",
    },
    sqa:{
        required:"*Required",
        maxLength:100,
        minLength:3,
    },
    addOnBaggage:{
        required:"*Required",
    }
}