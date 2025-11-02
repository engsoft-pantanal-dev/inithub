import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="h-screen w-full relative">
            <img 
                src="/images/login-banner.jpg"
                alt="Image"
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute bottom-8 flex flex-col md:flex-row gap-6 w-full px-8 items-center justify-center">
                <div className="bg-white rounded-2xl py-0 p-6 shadow-lg flex items-center gap-4 flex-[1] max-w-[400px] mx-auto md:mx-0 h-full">
                    <div className="flex-shrink-0 w-full h-full max-w-[300px] max-h-[500px]">
                        <Link
                            to="/home"
                            className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--green-primary)]"
                            aria-label="Ir para a página inicial"
                        >
                            <img 
                                src="/images/logo-comitiva.svg" 
                                alt="Comitiva Pantaneira Logo" 
                                className="w-full h-full object-contain transition-transform duration-150 ease-in-out hover:scale-105 cursor-pointer"
                            />
                        </Link>
                    </div>
                </div>

                <div className="bg-white py-0 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-4 flex-[2] max-w-[600px] xl:max-w-[500px] mx-auto md:mx-0 h-full">
                    <div className="flex-shrink-0">
                        <img 
                            src="/images/logo-inithub.svg" 
                            alt="InitHub Logo" 
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="mt-2">
                            <p className="text-sm font-bold text-gray-800">Plataforma de Inovação Corporativa</p>
                            <p className="text-xs text-gray-600">Conecte ideias. Multiplique o seu impacto.</p>
                            <p className="text-xs text-gray-600">Transforme o futuro.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
