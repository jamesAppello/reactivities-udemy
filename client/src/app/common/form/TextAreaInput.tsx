import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

// react-final-form and semantic-ui-react both brovide types we can use
// WHY DOES <HTMLELEMENT> WORK AND NOT "...TEXTAREA..."?
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}


const TextAreaInput: React.FC<IProps> = ({
    input,
    width,
    rows,
    placeholder,
    meta: { touched, error }
}) => {
    return (
        <>
        <Form.Field error={touched && !!error} width={width}>
            <textarea
            rows={rows} 
            {...input} // onChange/-Blur & value ('final-form-react')
            placeholder={placeholder} 
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>  
        </>
    )
}
export default TextAreaInput;