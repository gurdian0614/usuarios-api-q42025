import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import type { FormData } from "../types/FormData";
import type { UserApi } from "../types/UserApi";

const useUser = () => {
    const [users, setUsers] = useState<UserApi[]>([]);
    const [userToEdit, setUserToEdit] = useState<UserApi | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        avatar: 'https://placehold.co/600x400/004AAD/FFF?text=user+avatar',
    });

    const API_URL = 'https://api.escuelajs.co/api/v1/users';

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get<UserApi[]>(API_URL);
            setUsers(response.data);
        } catch (err) {
            errorAlert('No se pudo cargar los usuarios. Por favor, intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const successAlert = (mensaje: string) => {
        Swal.fire({
            title: mensaje,
            icon: 'success'
        });
    };

    const errorAlert = (mensaje: string) => {
        Swal.fire({
            title: mensaje,
            icon: 'error'
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const hanldleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (userToEdit) {
                await axios.put(`${API_URL}/${userToEdit.id}`, {
                    name: formData.name,
                    avatar: formData.avatar,
                });
                successAlert('Usuario actualizado correctamemnte.');
            } else {
                await axios.post(API_URL, {
                    ...formData,
                    role: 'customer',
                });
                successAlert('Usuario creado correctamente.');
            }

            setFormData({
                name: '',
                email: '',
                password: '',
                avatar: 'https://placehold.co/600x400/004AAD/FFF?text=user+avatar',
            });
            setUserToEdit(null);
            await fetchUsers();
        } catch (error) {
            errorAlert('Error al guardar el usuario. Verifique los datos.');
            console.error(error);
        }
    };

    const handleEdit = (user: UserApi) => {
        setUserToEdit(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            avatar: user.avatar,
        });
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No hay vuelta atrás!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if(result.isConfirmed) {
                await axios.delete(`${API_URL}/${id}`);
                await fetchUsers();
                successAlert('Usuario eliminado correctamente');
            }
        } catch (error) {
            errorAlert('Error al eliminar un usuario');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        userToEdit,
        setUserToEdit,
        loading,
        formData,
        setFormData,
        handleInputChange,
        hanldleSubmit,
        handleDelete,
        handleEdit,
    };
}

export default useUser;