import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useAuth } from "@/hooks/useAuth"; 

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null); 

    const { login } = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); 
        setError(null);     

        try {
            await login(email, password);

            
        } catch (err) {
            console.error('Erro no login:', err);
            setError("Email ou senha inválidos. Tente novamente.");
        } finally {
            setIsLoading(false); 
        }
    };

    const goToCreateAccount = () => {
        navigate("/create-account");
    }

    return (
        <div className="flex flex-col gap-6">
            <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Acesse sua conta</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Entre ou crie um novo espaço organizacional
                    </p>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        className="bg-transparent"
                        id="email" 
                        type="email" 
                        placeholder="seu.email@empresa.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                        className="bg-transparent"
                        id="password" 
                        type="password" 
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                <div className="grid gap-3">
                    <Button 
                        type="submit" 
                        className="w-full shadow-md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <Button 
                        type="button"
                        variant="muted" 
                        className="w-full"
                        onClick={goToCreateAccount}
                    >
                        Criar Conta    
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;