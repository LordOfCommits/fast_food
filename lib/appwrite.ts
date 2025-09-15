import { CreateUserParams, SignInParams, User } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
} from "react-native-appwrite";

type UserDocument = User & Models.Document;

export const appwriteConfig = {
  endpoing: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.foodordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "68c51b18002dc04524d6",
  bucketId: '68c80ecc00368a358b7f',
  userCollectionId: "lskjgsouidjghisau123",
  categoriesCollectionId: 'dsfsdf1234sdfsdfsdf',
  menuCollectionId: 'sdfsdfsdf112eaf',
  custamizationsCollectionId: 'dafslkjsdof987a9s8yiajsh',
  menuCustomizationCollectionId: 'sadfasfasdf124rqsdaf'
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoing)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);

export const databases = new Databases(client);

const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;
    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try { 
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error as string);
  }
};
