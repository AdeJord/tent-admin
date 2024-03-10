import { FC, MouseEventHandler, ReactNode, useState } from "react";
import {
    Root,
    DangerModalRoot,
    DangerModalHeader,
    DangerModalContent,
    DangerModalFooter,
    Button,
    ButtonContainer
} from "../../styles";
import ReactDOM from "react-dom";
import Modal from "./Modal";

interface ModalProps {
    onClick: MouseEventHandler<HTMLDivElement>;
    header: string;
    content: ReactNode;
    footer: ReactNode;
}


const DangerModal: FC<ModalProps> = ({ onClick, header, content, footer }: ModalProps) => {
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const modalContent = (
        <Root>
            <DangerModalRoot>
                <div onClick={onClick}>
                    <div>
                        <DangerModalHeader><h3>{header}</h3></DangerModalHeader>
                        <DangerModalContent>{content}</DangerModalContent>
                        <DangerModalFooter>{footer}</DangerModalFooter>
                    </div>
                </div>
            </DangerModalRoot>
        </Root>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-hook')!);
};


export default DangerModal;