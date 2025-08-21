// import React from 'react';

// interface ButtonProps {
//     text:string,
//     onClick: ()=> void
// }
// export function Button({text,onClick}:ButtonProps){
//     return
//     <button onClick={onClick}>
//     {text}
//     </button>
// }



type ButtonProps = {
  text: string
  onClick:void
}

export function Button({ text, onClick }: ButtonProps) {
  return <button onClick={ () => onClick}>{text}</button>
}