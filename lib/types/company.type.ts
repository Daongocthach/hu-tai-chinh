import { ImageSourcePropType } from "react-native";

export type CompanyHeader = {
    name: string,
    description: string,
    link: string | undefined,
    logo: ImageSourcePropType,
}