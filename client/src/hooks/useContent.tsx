import { useEffect, useState } from "react";
import { AdminSidebarRoutes } from "@myLayout/adminSidebar.layout";
import { UserSidebarLayout } from "@myLayout/userSidebar.layout";
import { UserRole } from "@myTypes/user.types";
type ContentItem = {
    name: string;
    element: JSX.Element;
    key: string;
}


const useContent = (userRole: UserRole | undefined) => {
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [content, setContent] = useState<ContentItem|null>();


    // This encapsulates all the content based on userRole
    // To add content, enter them in adminSidebar.layout
    // Abstract use of sidebard is not supported yet
    
    useEffect(() => {
        if (userRole === UserRole.admin) {
            const accessibleContent = Object.entries(AdminSidebarRoutes).map(([key, {name, element}]) => ({
                name: name,
                element: element,
                key: key,
            }));
            
            setContents(accessibleContent );
        }
        else if(userRole === UserRole.user){
            const accessibleContent = Object.entries(UserSidebarLayout).map(([key, {name, element}]) => ({
                name: name,
                element: element,
                key: key,
            }));
            
            setContents(accessibleContent );
        }
        else {
            setContents([]);
        }
    }, [userRole]);
    
    const switchContent = (newKey: string) => {
        const exists = contents.find(content => content.key === newKey);
        if (exists) {
            setContent(exists);
        } else {
            console.error("Content does not exist.");
        }
    };
    
    
    return { contents , content, switchContent};
}

export default useContent;
