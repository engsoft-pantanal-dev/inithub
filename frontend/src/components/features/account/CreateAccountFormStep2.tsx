import { useNavigate } from 'react-router-dom';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { authService } from '@/services/auth';
import type {CreateUserDto } from '@/services/auth';
import { useState } from 'react'; 

interface CreateAccountFormStep2Props {
  onBack: () => void;
  formData: Partial<CreateUserDto>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateAccountFormStep2 = ({ onBack, formData, handleChange }: CreateAccountFormStep2Props) => {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!formData.name || !formData.department || !formData.email || !formData.password) {
      alert('Parece que alguns dados do passo anterior se perderam. Por favor, volte e verifique.');
      return;
    }

    try {
      await authService.register(formData as CreateUserDto);

      alert('Conta criada com sucesso! Você será redirecionado para o login.');
      navigate('/login');

    } catch (error) {
      console.error('Erro ao criar a conta:', error);
      alert('Não foi possível criar a conta. O email já pode estar em uso.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Informações de Acesso</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Defina seu e-mail e senha para acessar a plataforma
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Corporativo</Label>
          <Input
            className="bg-transparent"
            id="email" 
            type="email"
            placeholder="admin@inithub.com"
            required
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            className="bg-transparent"
            id="password" 
            type="password"
            placeholder="Digite sua senha"
            required
            value={formData.password || ''}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            className="bg-transparent"
            id="confirmPassword"
            type="password"
            placeholder="Digite sua senha novamente"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Button type="submit" className="w-full shadow-md">
            Criar Sua Conta
          </Button>
          <Button
            variant="muted"
            className="w-full"
            onClick={onBack}
            type="button"
          >
            Voltar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountFormStep2;