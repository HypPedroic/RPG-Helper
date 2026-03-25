import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../services/api";
import { isEmailValid } from "../utils/utils";


export function useLoginValid() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

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
			const response = await loginUser({ email, password });
			console.log("Login successful:", response.data);
			setSuccessMessage("Login realizado com sucesso! Redirecionando...");
			setTimeout(() => {
				navigate("/teste", { state: { user: response.data } });
			}, 1500);
		} catch (error) {
			setErrorMessage("Falha no login. Verifique e-mail e senha.");
			console.error("Login failed:", error);
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
