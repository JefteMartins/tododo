import { ButtonHTMLAttributes } from "react";
import { Slot } from '@radix-ui/react-slot';
import { Button as RadixButton } from '@radix-ui/themes'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    color: 'grass' | 'crimson';
}

export function Button({ color, ...props }: ButtonProps) {
    const Component = props.asChild ? Slot : RadixButton;
    return (
        <Component
            radius="small"
            color={`${color}`}
            variant="soft"
            {...props}
        />
    );
}