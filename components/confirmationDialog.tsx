import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

export function ConfirmationDialog(
    {
        title, 
        description,  
        handleConfirm, 
        status,
        isOpen,
        onClose
    } : 
    {
        title:string, 
        description:string,  
        handleConfirm: (status: string) => void, 
        status:string,
        isOpen: boolean;
        onClose: () => void;
    }
){
    return <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
            {description}
        </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button onClick={() =>  {handleConfirm(status); onClose();}}>Confirm</Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>
}