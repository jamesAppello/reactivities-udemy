import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';


interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
    input,
    date = false,
    time = false,
    width,
    placeholder,
    meta: { touched, error },
    r
}) => {
    return (
        <>
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                //onblur is responsible for handling which component was touched
                onBlur={input.onBlur} //explicitly like onchange
                onKeyDown={(e) => e.preventDefault()}
                date={date}
                time={time}
                {...r}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field> 
        </>
    )
}
export default DateInput;