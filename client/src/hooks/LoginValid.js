import { useState, useEffect} from "react";
import { useNavigate } from "react-router";
import { isEmailValid } from "../utils/utils";
import { useAuth } from "./useAuth";


export function useLoginValid() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const { signIn } = useAuth();

	const hasEmailError = email.trim() !== "" && !isEmailValid(email);
	const isFormFilled = email.trim() !== "" && password.trim() !== "";
	const isFormValid = isFormFilled && !hasEmailError;

	// Limpar mensagens de sucesso após 5 segundos
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	// Limpar mensagens de erro após 5 segundos
	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => setErrorMessage(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

	const handleLogin = async () => {
		if (!isFormValid || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);
			setErrorMessage("");

			await signIn({ email, password });
			setSuccessMessage("Login realizado com sucesso! Redirecionando...");
			setTimeout(() => {
				navigate("/dashboard");
			}, 1500);
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Ocorreu um erro durante o login.";
			setErrorMessage(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		email, setEmail,
		password, setPassword,
		hasEmailError,
		isFormValid,
		isSubmitting,
		handleLogin,
		successMessage,
		errorMessage,
	};
}
