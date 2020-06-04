import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react';

// react-final-form and semantic-ui-react both brovide types we can use
// WHY DOES <HTMLELEMENT> WORK AND NOT "...TEXTAREA..."?
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
    input,
    width,
    options,
    placeholder,
    meta: { touched, error }
}) => {
    return (
        <>
        <Form.Field error={touched && !!error} width={width}>
            <Select
                // need to handle onchange
                value={input.value}
                onChange={(e, data) => input.onChange(data.value)}
                placeholder={placeholder}
                options={options}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>  
        </>
    )
}
export default SelectInput;