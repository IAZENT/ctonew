'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MoreHorizontal, Edit, Eye, Trash2, Copy, 
  Filter, Search, X, Download,
  CheckCircle, Circle
} from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { TableHeader } from '../components/TableHeader'
import { BulkActionsBar } from '../components/BulkActionsBar'
import { FilterPanel } from '../components/FilterPanel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { toast } from 'sonner'

interface Product {
  id: string
  productName: string
  modelNumber: string
  category?: { name: string }
  status: 'draft' | 'published' | 'archived'
  price: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface FilterState {
  status: string[]
  category: string[]
  featured: boolean | null
  dateFrom: string
  dateTo: string
  priceFrom: string
  priceTo: string
  search: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    category: [],
    featured: null,
    dateFrom: '',
    dateTo: '',
    priceFrom: '',
    priceTo: '',
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [filters, sortColumn, sortDirection, currentPage, itemsPerPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortColumn,
        direction: sortDirection,
        ...filters,
      })

      const response = await fetch(`/api/admin/products?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error('Failed to load products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column)
    setSortDirection(direction)
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(products.map(p => p.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: Array.from(selectedItems),
        }),
      })

      if (!response.ok) throw new Error('Bulk action failed')
      
      toast.success(`Bulk action completed successfully`)
      setSelectedItems(new Set())
      fetchProducts()
    } catch (error) {
      toast.error('Failed to perform bulk action')
      console.error(error)
    }
  }

  const handleRowAction = async (action: string, productId: string) => {
    switch (action) {
      case 'edit':
        router.push(`/admin/products/${productId}/edit`)
        break
      case 'view':
        router.push(`/products/${productId}`)
        break
      case 'delete':
        if (confirm('Are you sure you want to delete this product?')) {
          try {
            const response = await fetch(`/api/admin/products/${productId}`, {
              method: 'DELETE',
            })
            if (!response.ok) throw new Error('Delete failed')
            toast.success('Product deleted successfully')
            fetchProducts()
          } catch (error) {
            toast.error('Failed to delete product')
            console.error(error)
          }
        }
        break
      case 'duplicate':
        try {
          const response = await fetch(`/api/admin/products/${productId}/duplicate`, {
            method: 'POST',
          })
          if (!response.ok) throw new Error('Duplicate failed')
          toast.success('Product duplicated successfully')
          fetchProducts()
        } catch (error) {
          toast.error('Failed to duplicate product')
          console.error(error)
        }
        break
    }
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      category: [],
      featured: null,
      dateFrom: '',
      dateTo: '',
      priceFrom: '',
      priceTo: '',
      search: '',
    })
    setCurrentPage(1)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'search' && value && (Array.isArray(value) ? value.length > 0 : true)
  )

  const columns = [
    { key: 'productName', label: 'Name', sortable: true, width: 'w-1/4' },
    { key: 'modelNumber', label: 'SKU', sortable: true, width: 'w-1/6' },
    { key: 'category', label: 'Category', sortable: true, width: 'w-1/6' },
    { key: 'status', label: 'Status', sortable: true, width: 'w-1/8' },
    { key: 'price', label: 'Price', sortable: true, width: 'w-1/8' },
    { key: 'createdAt', label: 'Created Date', sortable: true, width: 'w-1/6' },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/products/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('export')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <FilterPanel
        isOpen={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        collection="products"
      />

      <div className="bg-card rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
              columns={columns}
              onSort={handleSort}
              currentSort={{ column: sortColumn, direction: sortDirection }}
              showCheckbox={true}
              allSelected={selectedItems.size === products.length}
              onSelectAll={selectAll}
            />
            <tbody className="bg-card divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleItemSelection(product.id)}
                      className="flex items-center justify-center"
                    >
                      {selectedItems.has(product.id) ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.modelNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.category?.name || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleRowAction('edit', product.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRowAction('view', product.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRowAction('duplicate', product.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRowAction('delete', product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Box className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/products/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Create First Product
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {Math.min(products.length, itemsPerPage)} of {products.length} products
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {selectedItems.size > 0 && (
        <BulkActionsBar
          count={selectedItems.size}
          onAction={handleBulkAction}
          onClear={() => setSelectedItems(new Set())}
        />
      )}
    </div>
  )
}