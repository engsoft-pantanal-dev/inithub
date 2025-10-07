import { useState } from "react";
import Banner from "@/components/layout/Banner";
import CreateAccountFormStep1 from "@/components/features/account/CreateAccountFormStep1";
import CreateAccountFormStep2 from "@/components/features/account/CreateAccountFormStep2";
import type { CreateUserDto } from "@/services/auth"; 

const CreateAccount = () => {
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState<Partial<CreateUserDto>>({
        name: '',
        department: '',
        email: '',
        password: '',
        isAdmin: false,
        emojiAvatar: '👤',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const nextStep = () => {
        setStep(2);
    }

    const previousStep = () => {
        setStep(1);
    }

    return (
        <div className="min-h-screen">
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-[60%]">
                <Banner />
            </div>

            <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted lg:ml-[60%] min-h-screen">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {step === 1 ? (
                            <CreateAccountFormStep1 
                                onNext={nextStep} 
                                formData={formData}
                                handleChange={handleFormChange}
                            />
                        ) : (
                            <CreateAccountFormStep2 
                                onBack={previousStep} 
                                formData={formData}
                                handleChange={handleFormChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;