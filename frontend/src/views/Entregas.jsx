import React from "react";
import { Layout } from "../components/Layout";
import Dashboard from "../Dashboard";

const Entregas = () => {

  return (
    <Dashboard title={"Entregas"}>
        <form className="max-w-sm mx-auto flex flex-col gap-5">
        <div className="mb-5"> 
            <label for="fecha" className="label">Fecha de entrega*</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <input type="date" id="fecha" className="input" placeholder="name@flowbite.com" required />
            </div>   
        </div>
        <div className="mb-5">
            <label for="hora" className="label">Hora de entrega*</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <input type="time" id="hora" className="input" placeholder="name@flowbite.com" required />
            </div>   
        </div>

        <div className="mb-5">
            <label for="productoTitulo" className="label">Titulo del producto*</label>
            <div class="input-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>

                <input type="text" id="productoTitulo" className="input" placeholder="Cajas de leche" required />
            </div>  
        </div>
        <div className="mb-5">
            <label for="estado" className="label ">Estado del producto*</label>
            <div class="input-icon-wrapper">
                <select className="inputSelect">
                    <option value="" disabled>
                        Seleccionar
                    </option>
                    <option value=""></option>
                </select>
            </div>  
        </div>
        <div className="mb-5">
            <label for="proveedor" className="label">Proveedor*</label>
                <div class="input-icon-wrapper">
                    <select className="inputSelect" placeholder="">
                        <option value="" disabled>
                            Seleccionar
                        </option>
                        <option value=""></option>
                    </select>
                </div>  
        </div>
        <div className="">
            <button type="submit" className="button">Registrar</button>
        </div>
        
        </form>
    </Dashboard>
  );
};

export default Entregas;
