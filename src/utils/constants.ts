
export const formErrors = {
	required: 'Обязательное поле',
	minLength: (count: number) => `Минимальное количество символов: ${count}`,
	maxLength: (count: number) => `Максимальное количество символов: ${count}`,
	unique: (fieldName: string) => `Значение поля ${fieldName} должно быть уникальным`
}