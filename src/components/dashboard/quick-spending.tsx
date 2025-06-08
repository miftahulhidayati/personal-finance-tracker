'use client';

import React, { useState } from 'react';
import {
  Plus,
  ShoppingCart,
  Car,
  Coffee,
  Home,
  Smartphone,
  Heart,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface SpendingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const spendingCategories: SpendingCategory[] = [
  { id: 'food', name: 'Food & Dining', icon: Coffee, color: 'bg-orange-500' },
  { id: 'transport', name: 'Transportation', icon: Car, color: 'bg-blue-500' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: 'bg-purple-500' },
  { id: 'bills', name: 'Bills & Utilities', icon: Home, color: 'bg-red-500' },
  { id: 'entertainment', name: 'Entertainment', icon: Smartphone, color: 'bg-pink-500' },
  { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'bg-green-500' },
  { id: 'education', name: 'Education', icon: BookOpen, color: 'bg-indigo-500' },
  { id: 'other', name: 'Other', icon: DollarSign, color: 'bg-gray-500' },
];

export function QuickSpending() {
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setSelectedCategory(null);
    setAmount('');
    setDescription('');
    setIsSubmitting(false);

    // Show success feedback
    console.log('Expense added:', { category: selectedCategory, amount, description });
  };

  const formatInputValue = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';

    // Format as currency
    const number = parseInt(numericValue);
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputValue(e.target.value);
    setAmount(formatted);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Quick Add Expense</h3>
          <p className="text-sm text-neutral-500">Record your spending instantly</p>
        </div>
        <div className="w-10 h-10 bg-lime-100 rounded-xl flex items-center justify-center">
          <Plus className="w-5 h-5 text-lime-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Select Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {spendingCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory?.id === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 text-left
                    ${isSelected
                      ? 'border-lime-300 bg-lime-50 ring-2 ring-lime-200'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Amount (IDR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 font-medium">
              Rp
            </span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="input pl-12 pr-4 py-3 text-lg font-semibold"
              required
            />
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="input"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCategory || !amount || isSubmitting}
          className={`
            w-full btn py-3 font-semibold text-base
            ${(!selectedCategory || !amount)
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed transform-none'
              : 'btn-primary'
            }
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Expense...</span>
            </div>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>
    </div>
  );
}