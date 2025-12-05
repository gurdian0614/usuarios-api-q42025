export interface FormData {
    name: string;
    email: string;
    avatar: string;
    password?: string; // Lo definimos opcional porque al 'Cancelar' no lo estás enviando
}