
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';

interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'add-product' | 'receive-lot' | 'record-adjustment';
}

const InventoryDrawer = ({ isOpen, onClose, action }: InventoryDrawerProps) => {
  const getTitle = () => {
    switch (action) {
      case 'add-product':
        return 'Add New Product';
      case 'receive-lot':
        return 'Receive New Lot';
      case 'record-adjustment':
        return 'Record Inventory Adjustment';
      default:
        return 'Quick Action';
    }
  };

  const getContent = () => {
    switch (action) {
      case 'add-product':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add a new product to your inventory. This form will create the product entry and allow you to receive lots.
            </p>
            {/* Product form would go here */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">Product form components will be implemented here</p>
            </div>
          </div>
        );
      case 'receive-lot':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Receive a new lot for an existing product. Select the product and enter lot details.
            </p>
            {/* Lot form would go here */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">Lot receiving form components will be implemented here</p>
            </div>
          </div>
        );
      case 'record-adjustment':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Record an inventory adjustment for a specific lot. This includes donations, theft, spoilage, or corrections.
            </p>
            {/* Adjustment form would go here */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">Adjustment form components will be implemented here</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle>{getTitle()}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-6 overflow-y-auto">
          {getContent()}
          <div className="flex gap-2 mt-8">
            <Button className="flex-1">Save</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default InventoryDrawer;
