import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { CheckIcon, TrashIcon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import * as Toast from '@radix-ui/react-toast';


interface Task {
    id: number;
    text: string;
    done: boolean;
}

export function ToDo() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = React.useState(false);
    const timerRef = React.useRef(0);
    const [taskState, setTaskState] = useState('');

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    React.useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);
    


    const addTask = (task: string) => {
        if (tasks.length >= 6) {
            handleToast("em excesso! Termine uma tarefa para adicionar outra");
            return;
        }
        if (task.length > 120) {
            handleToast("muito longa! Tente uma tarefa com no máximo 120 caracteres");
            return;
        }
        if (task.length > 0) {
            const newTask: Task = {
                id: Date.now(),
                text: task,
                done: false,
            };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
    };

    const removeTask = (id: number) => {
        handleToast("excluída");
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const markTaskAsDone = (id: number) => {
        setTasks(tasks.map((task) => {
            if (task.id === id) {
                if (task.done) {
                    handleToast("desmarcada");
                    return { ...task, done: false };
                }
                handleToast("concluída");
                return { ...task, done: true };
            }
            return task;
        }));
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return { ...task, done: !task.done };
            }
            return task;
        });
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTask(e.currentTarget.value);
            e.currentTarget.value = '';
        }
    }
    const handleToast = (state: string) => {
        setOpen(false);
        setTaskState(state);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setOpen(true);
        }, 100);
    }
    return (
        <>
            <div className="container mx-auto bg-white bg-opacity-75 rounded shadow-md shadow-gray-300 p-4 max-w-96">
                <h1 className="text-3xl font-bold pb-4">É PRA HOJE!!!!</h1>
                <div className='flex flex-row space-x-1'>
                <input type="text"
                    className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none min-w-80"
                    placeholder="Comprar café"
                    onKeyDown={handleKeyDown}
                />
                </div>
                <ul className="list-none">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between border-b border-gray-300 p-2 space-x-4">
                            <span className={`font-medium ${task.done ? 'line-through text-zinc-500' : ''} text-wrap break-words max-w-60 pt-2`}>
                                <Text>
                                    {task.text}
                                </Text>
                            </span>
                            <div className="flex flex-row-reverse space-x-1 space-x-reverse">
                                <Button color='crimson' onClick={() => removeTask(task.id)}>
                                    <TrashIcon />
                                </Button>
                                <Button color='grass' onClick={() => markTaskAsDone(task.id)}>
                                    <CheckIcon />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Toast.Provider swipeDirection="right">
                <Toast.Root
                    className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                    open={open}
                    onOpenChange={setOpen}
                    duration={1000}
                >
                    <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                        {`Tarefa ${taskState}.`}
                    </Toast.Title>
                </Toast.Root>
                <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
            </Toast.Provider>
        </>
    );
};

