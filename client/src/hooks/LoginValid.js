import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../services/api";
import { isEmailValid } from "../utils/utils";


export function useLoginValid() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const hasEmailError = email.trim() !== "" && !isEmailValid(email);
	const isFormFilled = email.trim() !== "" && password.trim() !== "";
	const isFormValid = isFormFilled && !hasEmailError;

	const handleLogin = async () => {
		if (!isFormValid || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await loginUser({ email, password });
			console.log("Login successful:", response.data);
			navigate("/teste", { state: { user: response.data } });
		} catch (error) {
			console.error("Login failed:", error);
			alert("Falha no login. Verifique e-mail e senha.");
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
	};
}
