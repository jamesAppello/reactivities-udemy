import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

// react-final-form and semantic-ui-react both brovide types we can use
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}


const TextInput: React.FC<IProps> = ({ 
    input, 
    width, 
    type, 
    placeholder, 
    meta: { touched, error } 
}) => {
    return (
        <>
        <Form.Field error={touched && !!error} type={type} width={width}>
            <input 
            {...input} // onChange/-Blur & value ('final-form-react')
            placeholder={placeholder} 
            type="text"/>
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>   
        </>
    )
}
export default TextInput;