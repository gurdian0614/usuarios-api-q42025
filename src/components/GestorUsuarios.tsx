//import useUser from "../hooks/useUser";
import UserForm from "./UserForm"; 
import UserList from "./UserList";

const GestorUsuarios = () => {
    return (
        <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10 tracking-tight">
                Gestión de Usuarios
            </h1>

            <UserForm
            />

            <UserList 
            />
        </div>
    );
}

export default GestorUsuarios;