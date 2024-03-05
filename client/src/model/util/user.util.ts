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

function calculateAge(dob:string){
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}

function includeUserGender(gender:UserGender){
    return (Object.values(UserGender).includes(gender))
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
    confirmPassword:{
        validate: (value:string, before:string) => value === before || "Passwords do not match"
    },
    gender: {
        required:"*Required",
        validate: (value:UserGender) => includeUserGender(value)
    },
    dob: {
        required:"*Required",
        validate: (value:string) => calculateAge(value) >= 13 || "You must be at least 13 years old",
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