import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProhibitedItems, useSaveProhibitedItems } from '@/hooks/useProhibitedItems';

export default function ProhibitedItemsList() {
  const { data: items = [], isLoading } = useProhibitedItems();
  const saveItems = useSaveProhibitedItems();
  const [newItem, setNewItem] = useState('');
  const [localItems, setLocalItems] = useState<string[] | null>(null);

  const currentItems = localItems ?? items;

  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...currentItems, newItem.trim()];
    setLocalItems(updated);
    saveItems.mutate(updated);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index);
    setLocalItems(updated);
    saveItems.mutate(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  if (isLoading) return <div className="h-32 bg-muted animate-pulse rounded-lg" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Itens Proibidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Medicamentos, Armas, Baterias >100Wh..."
          />
          <Button onClick={addItem} size="icon" disabled={!newItem.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum item proibido cadastrado.</p>
          ) : (
            currentItems.map((item, i) => (
              <Badge key={i} variant="secondary" className="gap-1 pr-1">
                {item}
                <button
                  onClick={() => removeItem(i)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
