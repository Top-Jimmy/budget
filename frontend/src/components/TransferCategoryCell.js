import React, { useContext, useState } from 'react';

import Dropdown from '../components/Dropdown2';
import CategoryDialog from '../components/CategoryDialog';
import { FirebaseContext } from '../state/FirebaseProvider';

const options = [
    {label: 'Monthly'},
    {label: 'Biannual'},
    {label: 'Yearly'},
];

const TransferCategoryCell = props => {
    const { transfer } = props;
    const { categories: transfer_categories } = transfer;

    const [userState] = useContext(FirebaseContext);
    const { userDoc } = userState;
    const categories = userDoc.categories || [];

    const [categoryDialog, setCategoryDialog] = useState(false);
    const showAddCategory = setCategoryDialog(true);
    
    const renderedCategoryDialog = categoryDialog ? (
        <CategoryDialog />
    ): null;
    

    let content;
    if (categories.length) {
        const budgetOptions = categories.map((c) => {
            return {label: c.name};
        });
        content = <Dropdown options={budgetOptions}/>
    } else {
        content = <div onClick={showAddCategory} >Choose a category</div>;
    }
    return (
        <td>{renderedCategoryDialog}{content}</td>
    );
};
export default TransferCategoryCell;