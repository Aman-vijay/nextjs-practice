import bcrypt from "bcrypt";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { config } from "../../config";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const secret = new TextEncoder().encode(config.jwtSecret);

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (userId: string): Promise<string> => {
    return await new SignJWT({ sub: userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(token, secret);
    return payload;
};

export const getUser = async()=>{
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("token")?.value;
            if(!token){
                return null;
            }

            const decoded = await verifyToken(token);
            if (!decoded.sub) return null;


            const userfromDb = await db.query.users.findFirst({
                where:eq(users.id,decoded.sub as string)
            })

            if(!userfromDb) return null

            const {password,...user} = userfromDb;

            return user ;
        } catch(error)  {
            console.error("Error:",error); 
            return null
            
        }
}