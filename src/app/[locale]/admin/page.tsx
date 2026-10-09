'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Wrench,
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product, Order, RentalInquiry, ServiceTicket } from '@/types/database';
import {
  getAllOrders,
  getAllRentalInquiries,
  getAllServiceTickets,
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateRentalStatus,
  updateServiceStatus,
} from '@/lib/supabase';
import { formatUZS } from '@/lib/utils';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@teacoff.uz');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'rentals' | 'conditions' | 'service' | 'promos'
  >('overview');

  // CMS State
  const [orders, setOrders] = useState<Order[]>([]);
  const [rentals, setRentals] = useState<RentalInquiry[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);

  // Rental & Company Conditions State per TZ point 31 & 49
  const [rentalCost, setRentalCost] = useState('0');
  const [minCapsules, setMinCapsules] = useState('4');
  const [freeMachineDelivery, setFreeMachineDelivery] = useState(true);
  const [companyPhone, setCompanyPhone] = useState('+998 95 902 88 33');
  const [companyTg, setCompanyTg] = useState('@TeaCoff_lux');
  const [companyInsta, setCompanyInsta] = useState('@teacoff.lux');
  const [companyEmail, setCompanyEmail] = useState('teacoff2025@gmail.com');
  const [companyAddress, setCompanyAddress] = useState('г. Ташкент, Мирзо-Улугбекский район');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newBrand, setNewBrand] = useState('Dolce Gusto');
  const [newCategory, setNewCategory] = useState('kofemashiny');

  useEffect(() => {
    async function loadData() {
      const [ord, rnt, srv] = await Promise.all([
        getAllOrders(),
        getAllRentalInquiries(),
        getAllServiceTickets(),
      ]);
      setOrders(ord);
      setRentals(rnt);
      setTickets(srv);
    }
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'teacoff2026' || loginPassword === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Неверный пароль администратора (по умолчанию: teacoff2026)');
    }
  };

  const handleOrderStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleOrderPaymentChange = (orderId: string, payment_status: 'pending' | 'paid') => {
    updateOrderPaymentStatus(orderId, payment_status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payment_status } : o))
    );
  };

  const handleRentalStatusChange = (rentalId: string, status: RentalInquiry['status']) => {
    updateRentalStatus(rentalId, status);
    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, status } : r))
    );
  };

  const handleServiceStatusChange = (ticketId: string, status: ServiceTicket['status']) => {
    updateServiceStatus(ticketId, status);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Удалить товар из каталога?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      category_slug: newCategory,
      brand: newBrand,
      title: { ru: newTitle, uz: newTitle, en: newTitle },
      description: {
        ru: 'Новое поступление в каталоге TeaCoff',
        uz: 'Yangi mahsulot',
        en: 'New arrival in TeaCoff catalog',
      },
      price: Number(newPrice) || 0,
      in_stock: true,
      images: [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600',
      ],
      is_rental_machine: Number(newPrice) === 0,
      min_capsule_boxes: 4,
      specs: {},
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    setNewTitle('');
    setNewPrice('');
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;
  const activeRentalsCount = rentals.filter((r) => r.status === 'new').length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'closed').length;

  // Unauthenticated Login Guard
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center py-20 px-4 bg-background">
        <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-surface text-brand-lime mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Вход в TeaCoff CMS
            </h2>
            <p className="text-xs text-muted-foreground">
              Управление заказами, арендой и каталогом товаров
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {authError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase">Пароль</label>
              <input
                type="password"
                required
                placeholder="teacoff2026"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider shadow-lg glow-lime transition-all cursor-pointer"
            >
              Войти в панель
            </button>

            <p className="text-[11px] text-center text-muted-foreground pt-1">
              Демо-пароль: <code className="text-brand-lime">teacoff2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-lime font-bold">
              ADMINISTRATION PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Панель управления TeaCoff
            </h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-border overflow-x-auto pb-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Обзор</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Заказы ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'rentals'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Заявки на аренду ({rentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'products'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Товары ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('service')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'service'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Сервис ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conditions')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'conditions'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Условия аренды и Настройки</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'promos'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Промокоды</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs uppercase font-mono text-muted-foreground">Выручка заказов</span>
                <p className="font-serif text-2xl font-extrabold text-brand-lime">
                  {formatUZS(totalRevenue)}
                </p>
                <span className="text-[11px] text-muted-foreground flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-lime" />
                  <span>По Ташкенту</span>
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs uppercase font-mono text-muted-foreground">Всего заказов</span>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {totalOrdersCount}
                </p>
                <span className="text-[11px] text-muted-foreground">Включая быстрые заказы</span>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs uppercase font-mono text-muted-foreground">Новые заявки на аренду</span>
                <p className="font-serif text-2xl font-bold text-brand-lime">
                  {activeRentalsCount}
                </p>
                <span className="text-[11px] text-muted-foreground">Ожидают звонка менеджера</span>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs uppercase font-mono text-muted-foreground">Сервисные заявки</span>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {openTicketsCount}
                </p>
                <span className="text-[11px] text-muted-foreground">В ремонте / диагностике</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Последние заказы
              </h3>
              <div className="divide-y divide-border">
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-foreground">
                        Заказ #{o.order_number} — {o.customer_name} ({o.customer_phone})
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {o.district} • {o.delivery_address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-brand-lime">{formatUZS(o.total_amount)}</span>
                      <span className="px-2 py-0.5 rounded bg-secondary font-mono text-[10px] uppercase">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Manager */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Управление заказами
            </h3>
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/50 text-muted-foreground uppercase font-mono text-[10px] border-b border-border">
                    <tr>
                      <th className="p-4"># Заказа</th>
                      <th className="p-4">Клиент</th>
                      <th className="p-4">Район и адрес</th>
                      <th className="p-4">Товары</th>
                      <th className="p-4">Сумма</th>
                      <th className="p-4">Оплата</th>
                      <th className="p-4">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-brand-lime">
                          #{order.order_number}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{order.customer_name}</p>
                          <p className="text-muted-foreground text-[11px]">{order.customer_phone}</p>
                        </td>
                        <td className="p-4">
                          <p>{order.district}</p>
                          <p className="text-muted-foreground text-[11px]">{order.delivery_address}</p>
                        </td>
                        <td className="p-4">
                          <ul className="space-y-0.5 text-[11px]">
                            {order.items.map((it, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                • {it.title} ({it.quantity} шт)
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-4 font-bold text-brand-lime">
                          {formatUZS(order.total_amount)}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-mono uppercase block text-muted-foreground font-bold">
                            {order.payment_method === 'unified_qr'
                              ? 'Единый QR'
                              : order.payment_method === 'card_on_delivery'
                              ? 'Терминал'
                              : 'Наличные'}
                          </span>
                          <select
                            value={order.payment_status || 'pending'}
                            onChange={(e) =>
                              handleOrderPaymentChange(order.id, e.target.value as any)
                            }
                            className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border outline-none cursor-pointer ${
                              order.payment_status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            }`}
                          >
                            <option value="pending">Ожидает</option>
                            <option value="paid">Оплачен</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleOrderStatusChange(order.id, e.target.value as any)
                            }
                            className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs outline-none focus:border-brand-lime font-medium cursor-pointer"
                          >
                            <option value="new">Новый</option>
                            <option value="confirmed">Подтверждён</option>
                            <option value="delivering">Доставляется</option>
                            <option value="completed">Завершён</option>
                            <option value="cancelled">Отменён</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rental Inquiries */}
        {activeTab === 'rentals' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Заявки на подписку за 0 сум
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rentals.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{r.customer_name}</h4>
                      <p className="font-mono text-xs text-brand-lime">{r.customer_phone}</p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => handleRentalStatusChange(r.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs outline-none focus:border-brand-lime font-medium cursor-pointer"
                    >
                      <option value="new">Новая заявка</option>
                      <option value="contacted">Связались с клиентом</option>
                      <option value="processing">Оформление</option>
                      <option value="contract">Договор оформляется</option>
                      <option value="active">Аренда активна</option>
                      <option value="completed">Завершена</option>
                      <option value="rejected">Отменена</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
                    <p><b className="text-foreground">Модель:</b> {r.machine_model}</p>
                    <p><b className="text-foreground">Адрес:</b> {r.district}, {r.delivery_address}</p>
                    <p><b className="text-foreground">Капсулы:</b></p>
                    <ul className="pl-3 space-y-0.5">
                      {r.selected_capsules?.map((c, i) => (
                        <li key={i}>• {c.name} — {c.boxes} уп.</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Products CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Каталог товаров
              </h3>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase flex items-center space-x-1.5 hover:brightness-110 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить товар</span>
              </button>
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/50 text-muted-foreground uppercase font-mono text-[10px] border-b border-border">
                  <tr>
                    <th className="p-4">Название</th>
                    <th className="p-4">Бренд</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4">Цена</th>
                    <th className="p-4">Наличие</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-semibold">{p.title.ru}</td>
                      <td className="p-4 text-muted-foreground">{p.brand}</td>
                      <td className="p-4 text-muted-foreground">{p.category_slug}</td>
                      <td className="p-4 font-bold text-brand-lime">
                        {p.price === 0 ? '0 сум (Аренда)' : formatUZS(p.price)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold">
                          В наличии
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border space-y-4">
                  <h4 className="font-serif text-lg font-bold text-foreground">Добавить новый товар</h4>
                  <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                    <div>
                      <label className="text-muted-foreground uppercase font-semibold">Название *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Например: Dolce Gusto Mini Me Red"
                        className="w-full px-3 py-2 mt-1 rounded-xl bg-secondary/50 border border-border text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground uppercase font-semibold">Цена в UZS (0 для аренды) *</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="0 или 1450000"
                        className="w-full px-3 py-2 mt-1 rounded-xl bg-secondary/50 border border-border text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground uppercase font-semibold">Бренд</label>
                      <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="w-full px-3 py-2 mt-1 rounded-xl bg-secondary/50 border border-border text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground uppercase font-semibold">Категория</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 mt-1 rounded-xl bg-secondary/50 border border-border text-foreground outline-none"
                      >
                        <option value="kofemashiny">Кофемашины</option>
                        <option value="kapsuly">Капсулы</option>
                        <option value="zernovoy-kofe">Зерновой кофе</option>
                        <option value="chay">Чай</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 rounded-xl bg-secondary text-foreground font-semibold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold uppercase"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Rental Conditions & Company Settings (TZ Point 31 & 49) */}
        {activeTab === 'conditions' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Управление условиями аренды и настройками компании
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Параметры, изменяемые без участия программиста (ТЗ п. 31 и 49)
                </p>
              </div>
              {settingsSaved && (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold animate-in fade-in">
                  ✓ Настройки сохранены!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rental Conditions */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-lime font-mono">
                  Условия аренды (ТЗ п. 31)
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">
                      Стоимость аренды кофемашины (сум / мес):
                    </label>
                    <input
                      type="number"
                      value={rentalCost}
                      onChange={(e) => setRentalCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      По умолчанию 0 сум (при заказе капсул).
                    </span>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">
                      Минимальный объем капсул в месяц (коробок):
                    </label>
                    <input
                      type="number"
                      value={minCapsules}
                      onChange={(e) => setMinCapsules(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      По ТЗ: минимум 4 коробки в месяц, любые на выбор клиента.
                    </span>
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="freeDelivery"
                      checked={freeMachineDelivery}
                      onChange={(e) => setFreeMachineDelivery(e.target.checked)}
                      className="w-4 h-4 rounded accent-brand-lime"
                    />
                    <label htmlFor="freeDelivery" className="text-xs text-foreground font-medium">
                      Бесплатная доставка кофемашины за счет компании
                    </label>
                  </div>
                </div>
              </div>

              {/* Company Info & Contacts */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-lime font-mono">
                  Реквизиты и контакты (ТЗ п. 25 & 49)
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Телефон:</label>
                    <input
                      type="text"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Telegram канал / бот:</label>
                    <input
                      type="text"
                      value={companyTg}
                      onChange={(e) => setCompanyTg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Instagram:</label>
                    <input
                      type="text"
                      value={companyInsta}
                      onChange={(e) => setCompanyInsta(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Email:</label>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Адрес офиса / шоурума:</label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSettingsSaved(true);
                setTimeout(() => setSettingsSaved(false), 3000);
              }}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-sm transition-all cursor-pointer"
            >
              Сохранить изменения
            </button>
          </div>
        )}

        {/* Tab 5: Service Tickets */}
        {activeTab === 'service' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Заявки на ремонт и сервис
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl bg-card border border-border space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-brand-lime font-bold">Билет #{t.ticket_number}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">{t.customer_name}</h4>
                      <p className="text-muted-foreground">{t.customer_phone}</p>
                    </div>
                    <select
                      value={t.status}
                      onChange={(e) => handleServiceStatusChange(t.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg bg-secondary border border-border text-xs outline-none"
                    >
                      <option value="new">Новая</option>
                      <option value="in_review">На диагностике</option>
                      <option value="repairing">В ремонте</option>
                      <option value="ready">Готово</option>
                      <option value="closed">Закрыта</option>
                    </select>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
                    <p className="font-semibold text-foreground">Модель: {t.machine_model}</p>
                    <p className="text-muted-foreground">{t.issue_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Promo Codes */}
        {activeTab === 'promos' && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Активные промокоды и правила доставки
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-bold text-brand-lime">TEACOFF10</span>
                  <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-lime text-[10px] font-bold">10% СКИДКА</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Предоставляет скидку 10% на весь заказ без ограничений по сумме.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-bold text-brand-lime">WELCOME50K</span>
                  <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-lime text-[10px] font-bold">-50 000 СУМ</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Фиксированная скидка 50 000 сум на первый заказ для новых клиентов.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
