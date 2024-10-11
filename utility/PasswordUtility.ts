import bcrypt from 'bcrypt';

export const GenerateSalt = async() => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt);
}


export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ): Promise<boolean> => {
    const hashedEnteredPassword = await bcrypt.hash(enteredPassword, salt);
  
    // Compare the re-hashed entered password with the saved hashed password
    return hashedEnteredPassword === savedPassword;
  };