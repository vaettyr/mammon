export const required = (value) => (value === '' || value === undefined);
export const unique = (value, list) => (list && list.some(i => i === value));
export const option = (value, options) => (value && !(options && options.some(o => o.value === value && !o.disabled)));
export const phone = (value) => !(/\([0-9][\d]{2}\)\s[\d]{3}-[\d]{4}/).test(value);
export const email = (value) => !(/[\w]+@[\w]+\.[\w]+/).test(value);
export const secondline = (value, values) => (value !== '' && (!values.Line1 || values.Line1 === ''));
export const zipcode = (value) => !(/^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$/).test(value);
export const state = (value) => !(/^(?:A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/i)
									.test(value);


export const valid = (validators) => {
	return function(value) {
		let error = false;
		let errortext;
		Object.keys(validators).forEach(v=> {
			if(validators[v] && !error) {
				switch(v) {
				case 'required':
					error = required(value);
					if(error) 
						errortext = "Required"
					break;
				case 'unique':
					error = unique(value, validators[v]);
					if(error)
						errortext = "Must be unique";
					break;
				case 'option':
					error = option(value, validators[v]);
					if(error)
						errortext = "Invalid selection";
					break;
				case 'phone':
					error = phone(value);
					if(error)
						errortext = "Must be a valid phone number (xxx) xxx-xxxx";
					break;
				case 'email':
					error = email(value);
					if(error)
						errortext = "Must be a valid email address";
					break;
				case 'state':
					error = state(value);
					if(error) 
						errortext = "Must be a valid two-letter state code";
					break;
				case 'zipcode':
					error = zipcode(value);
					if(error)
						errortext = "Must be a valid zip code";
					break;
				case 'secondline':
					error = secondline(value, validators[v]);
					if(error)
						errortext = "Must be blank if there is no Line 1";
					break;
				default:
					error = false;
					errortext = "Unknown validator type specified: " + v;
					break;
				}	
			}			
		});
		return {isValid:error, error: errortext};
	}
};