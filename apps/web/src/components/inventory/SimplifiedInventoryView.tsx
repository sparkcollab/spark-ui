import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  DollarSign,
  AlertTriangle,
  MoreHorizontal,
  Truck,
  RotateCcw,
  Edit,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import SummaryCard from "../SummaryCard";
import InventoryActionDrawer from "./InventoryActionDrawer";
import { useInventory } from "@/store/useInventory";
import { Item } from "@/types/inventory";
import { useAuthStore } from "@/store/useAuthStore";

type DrawerAction =
  | "add-product"
  | "add-delivery"
  | "return-supplier"
  | "update-stock"
  | null;

const SimplifiedInventoryView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<DrawerAction>(null);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
  const { fetchItems, items } = useInventory();
  const { userState } = useAuthStore();
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    stockValue: 0,
    lowStockItems: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    userState.locationId && fetchItems();
    // Fetch products from API or state management store here
  }, [userState?.locationId]);

  useEffect(() => {
    const filteredProducts = items.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filteredProducts);
  }, [searchTerm, categoryFilter, items]);
  useEffect(() => {
    const totalProducts = items.length;
    const stockValue = items.reduce(
      (sum, product) => sum + product.stock * 1,
      0
    );
    const lowStockItems = items.filter((product) => product.stock <= 0).length;

    const categories = [...new Set(items.map((p) => p.category))];
    setSummary({ totalProducts, stockValue, lowStockItems });
    setCategories(categories);
  }, [items]);

  const handleAction = (action: DrawerAction, product?: Item) => {
    setSelectedProduct(product || null);
    setDrawerAction(action);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerAction(null);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Inventory Management
        </h1>
        <Button
          onClick={() => handleAction("add-product")}
          className="flex items-center space-x-2"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Active products in inventory"
          color="blue"
        />
        <SummaryCard
          title="Stock Value"
          value={`$${stockValue.toLocaleString()}`}
          icon={DollarSign}
          description="Total inventory value"
          color="green"
        />
        <SummaryCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          description="Products below threshold"
          color="orange"
        />
      </div> */}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Category
                  </th>
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Last Delivery
                  </th> */}
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {product.category} &gt; {product.subCategory}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-300 font-mono">
                      {product.sku}
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-300">
                      {product.category}
                    </td>
                    {/* <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.stock} {product.unitOfMeasure}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.activeLots} active lots
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-300">
                      ${product.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      {product.stock <= product.lowStockThreshold ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-300">
                      {product.lastDelivery || "N/A"}
                    </td> */}
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("add-delivery", product)
                            }
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Add Delivery
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("return-supplier", product)
                            }
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Return to Supplier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("update-stock", product)
                            }
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Update Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("add-product", product)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Drawer */}
      <InventoryActionDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        action={drawerAction}
        product={selectedProduct}
      />
    </div>
  );
};

export default SimplifiedInventoryView;
