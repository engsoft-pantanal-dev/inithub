import { useNavigate } from "react-router-dom";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import type { CreateUserDto } from "@/services/auth"; 

interface CreateAccountFormStep1Props {
  onNext: () => void;
  formData: Partial<CreateUserDto>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateAccountFormStep1 = ({ onNext, formData, handleChange }: CreateAccountFormStep1Props) => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    }

    const handleNext = (e: React.MouseEvent) => {
      e.preventDefault();
      onNext();
    }

    return (
        <div className="flex flex-col gap-6">
            <form className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Informações Pessoais</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Preencha seus dados para criar uma nova conta
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                        className="bg-transparent"
                        id="name" 
                        type="text" 
                        placeholder="Digite seu nome completo" 
                        required 
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input 
                        className="bg-transparent"
                        id="department" 
                        type="text" 
                        placeholder="Digite seu departamento" 
                        required 
                        value={formData.department || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="photo">Foto</Label>
                    <Input 
                        className="bg-transparent"
                        id="photo" 
                        type="file" 
                        accept="image/*"
                    />
                </div>

                <div className="grid gap-3">
                    <Button type="button" className="w-full shadow-md" onClick={handleNext}>
                        Próximo
                    </Button>
                    <Button 
                        onClick={goToLogin}
                        variant="muted" 
                        className="w-full" 
                        type="button"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateAccountFormStep1;