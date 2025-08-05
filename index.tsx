
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Translations ---
const TRANSLATIONS = {
    Analytics: 'Análisis',
    Production: 'Producción',
    Inventory: 'Inventario',
    Operators: 'Operadores',
    Dispatch: 'Despacho',
    Franchises: 'Franquicias',
    Store: 'Tienda',
    Referrals: 'Referidos',
    Users: 'Usuarios',
    Requests: 'Pedidos',
    Login: 'Iniciar Sesión',
    Logout: 'Cerrar Sesión',
    Username: 'Usuario',
    Password: 'Contraseña',
    loginToYourAccount: 'Inicie sesión en su cuenta',
    loginFailed: 'Usuario o contraseña incorrectos.',
    userManagement: 'Gestión de Usuarios',
    role: 'Rol',
    superAdmin: 'Super Administrador',
    franchiseManager: 'Gerente de Franquicia',
    addUser: 'Añadir Usuario',
    pleaseFillInAllFields: 'Por favor, rellene todos los campos.',
    selectFranchise: 'Seleccionar Franquicia',
    userCreatedSuccessfully: 'Usuario creado con éxito.',
    confirmDeleteUser: '¿Está seguro de que desea eliminar a este usuario?',
    notAuthorized: 'No está autorizado para ver esta página.',
    mainBusiness: 'Negocio Principal',
    totalRevenue: 'Ingresos Totales',
    totalItemsSold: 'Artículos Vendidos',
    avgRevenuePerDispatch: 'Ingresos Prom. / Despacho',
    totalItemsProduced: 'Artículos Producidos',
    topSellingItemsByRevenue: 'Más Vendidos (por Ingresos)',
    topSellingItemsByQuantity: 'Más Vendidos (por Cantidad)',
    topOperatorPerformance: 'Rendimiento de Operadores (por Ingresos)',
    units: 'unidades',
    noAnalyticsData: 'No Hay Datos de Análisis Disponibles',
    reconcileToSeeReports: 'Concilie un despacho para ver informes financieros y métricas de rendimiento.',
    registerProduction: 'Registrar Producción',
    manageProducibleItems: 'Gestionar Artículos Producibles',
    item: 'Artículo',
    quantityProduced: 'Cantidad Producida',
    productionHistory: 'Historial de Producción',
    date: 'Fecha',
    quantity: 'Cantidad',
    noProducibleItems: 'No hay artículos producibles',
    noProductionBatches: 'Aún no se han registrado lotes de producción.',
    alertSelectItemAndQuantity: 'Por favor seleccione un artículo e ingrese una cantidad válida.',
    addNewInventoryItem: 'Añadir Nuevo Artículo de Inventario',
    manageCategories: 'Gestionar Categorías',
    itemName: 'Nombre del Artículo',
    category: 'Categoría',
    addItem: 'Añadir Artículo',
    currentStock: 'Stock Actual',
    name: 'Nombre',
    stock: 'Existencias',
    sellable: 'Vendible',
    actions: 'Acciones',
    yes: 'Sí',
    no: 'No',
    uncategorized: 'Sin categoría',
    deleteItem: 'Eliminar artículo',
    cannotDeleteItemInUse: 'No se puede eliminar el artículo: se utiliza en producción, despachos o pedidos de franquicia.',
    noInventoryItems: 'Aún no hay artículos en el inventario.',
    alertProvideItemNameAndCategory: 'Por favor, proporcione un nombre de artículo y seleccione una categoría.',
    confirmDeleteItem: '¿Está seguro de que desea eliminar este artículo? Esta acción no se puede deshacer.',
    pleaseAddCategoryFirst: 'Por favor, añada una categoría primero',
    manageOperators: 'Gestionar Operadores',
    manageOperatorsFor: (name: string) => `Gestionar Operadores para ${name}`,
    newOperatorName: 'Nombre del nuevo operador',
    addOperator: 'Añadir Operador',
    noOperatorsAdded: 'Aún no se han añadido operadores.',
    delete: 'Eliminar',
    cannotDeleteOperatorInUse: 'No se puede eliminar el operador. Está asignado a uno o más despachos.',
    createNewDispatch: 'Crear Nuevo Despacho',
    operator: 'Operador',
    pleaseAddOperator: 'Por favor, añada un operador',
    inStock: 'Existencias',
    noItemsInDispatch: 'No hay artículos en el despacho.',
    creating: 'Creando...',
    createDispatch: 'Crear Despacho',
    dispatchHistory: 'Historial de Despachos',
    items: 'Artículos',
    status: 'Estado',
    dispatched: 'Despachado',
    reconciled: 'Conciliado',
    reconcile: 'Conciliar',
    view: 'Ver',
    duplicateDispatch: 'Duplicar Despacho',
    noDispatchesCreated: 'Aún no se han creado despachos.',
    alertSelectOperatorAndItems: 'Por favor, seleccione un operador y añada artículos al despacho.',
    alertOperatorNotFound: 'El operador para este despacho ya no existe.',
    alertWarningStock: (stock: number, name: string) => `Advertencia: Solo hay ${stock} unidades de ${name} disponibles. Ajustando cantidad.`,
    alertCannotAddStock: (quantity: number, maxAdd: number) => `No se puede añadir ${quantity}. Solo quedan ${maxAdd} disponibles en stock.`,
    producibleItems: 'Artículos Producibles',
    noItemsMarkedProducible: 'Ningún artículo está marcado actualmente como producible.',
    price: 'Precio',
    add: 'Añadir',
    allInvetoryIsProducible: 'Todos los artículos del inventario ya son producibles. Añada nuevos artículos en la vista de Inventario.',
    alertSelectItemAndPrice: 'Por favor, seleccione un artículo e ingrese un precio válido.',
    categories: 'Categorías',
    noCategoriesDefined: 'No hay categorías definidas.',
    newCategoryName: 'Nombre de la nueva categoría',
    cannotDeleteCategoryInUse: 'No se puede eliminar la categoría en uso',
    viewReconciliation: 'Ver Conciliación',
    reconcileDispatch: 'Conciliar Despacho',
    dispatchId: 'ID de Despacho',
    itemsSummary: 'Resumen de Artículos',
    dispatchedQty: 'Despachado',
    returned: 'Devueltos',
    sold: 'Vendidos',
    revenue: 'Ingresos',
    paymentsReceived: 'Pagos Recibidos',
    cashPayment: 'Pago en Efectivo',
    pagoConSinpe: 'Pago con Sinpe',
    financialSummary: 'Resumen Financiero',
    expectedRevenue: 'Ingresos Esperados',
    totalPaid: 'Total Pagado',
    discrepancy: 'Discrepancia',
    close: 'Cerrar',
    saveReconciliation: 'Guardar Conciliación',
    unknownItem: 'Artículo Desconocido',
    loadingYourBusiness: 'Cargando Su Negocio...',
    errorLoadingData: 'Error al cargar los datos. Por favor, actualice.',
    selectAView: 'Seleccione una vista',
    vanillaBeanPlaceholder: 'ej., Vainilla',
    quantityPlaceholder: 'ej., 50',
    newOperatorNamePlaceholder: 'Nombre del nuevo operador',
    newCategoryNamePlaceholder: 'Nombre de nueva categoría',
    pricePlaceholder: 'Precio',
    sinpeCalculator: 'Calculadora Sinpe',
    addTransaction: 'Añadir Transacción',
    transactionAmount: 'Monto de Transacción',
    transactionList: 'Lista de Transacciones',
    clearList: 'Limpiar Lista',
    totalSinpe: 'Total Sinpe',
    otherPayment: 'Otro Pago',
    manageFranchises: 'Gestionar Franquicias',
    newFranchiseNamePlaceholder: 'Nombre de la nueva franquicia',
    addFranchise: 'Añadir Franquicia',
    noFranchisesAdded: 'Aún no se han añadido franquicias.',
    cannotDeleteFranchiseInUse: 'No se puede eliminar la franquicia: tiene inventario o despachos.',
    transferInventory: 'Transferir Inventario',
    transferTo: (name: string) => `Transferir Inventario a ${name}`,
    itemsToTransfer: 'Artículos para Transferir',
    noItemsToTransfer: 'No hay artículos para transferir.',
    confirmTransfer: 'Confirmar Transferencia',
    transferring: 'Transfiriendo...',
    selectContext: 'Viendo:',
    franchiseViewNotAvailable: 'Esta vista solo está disponible para el Negocio Principal.',
    sale: 'Venta',
    consignment: 'Consignación',
    orderType: 'Tipo de Transferencia',
    franchiseOrders: 'Pedidos de Franquicia',
    payFranchiseOrder: 'Pagar Pedido de Franquicia',
    reconcileFranchiseOrder: 'Conciliar Pedido de Franquicia',
    settlePayment: 'Liquidar Pago',
    reconcileConsignment: 'Conciliar Consignación',
    orderStatus: 'Estado',
    pendingPayment: 'Pendiente de Pago',
    paid: 'Pagado',
    consignmentActive: 'Consignación Activa',
    consignmentReconciled: 'Consignación Conciliada',
    viewFranchiseOrder: 'Ver Pedido de Franquicia',
    noFranchiseOrders: 'Aún no se han creado pedidos para franquicias.',
    order: 'Pedido',
    viewOrder: 'Ver Pedido',
    franchise: 'Franquicia',
    duplicateOrder: 'Duplicar Pedido',
    partialPayment: 'Pago Parcial',
    consignmentPartial: 'Consignación Parcial',
    registerPayment: 'Registrar Pago',
    balance: 'Saldo',
    amountPaid: 'Monto Pagado',
    remainingBalance: 'Saldo Pendiente',
    savePayment: 'Guardar Pago',
    orderTotal: 'Total del Pedido',
    totalValue: 'Valor Total',
    newPayment: 'Registrar Nuevo Pago',
    franchiseInventoryTitle: 'Inventario de Franquicia',
    franchiseInventoryTitleFor: (name: string) => `Inventario de: ${name}`,
    saveChanges: 'Guardar Cambios',
    franchiseHasNoInventory: 'Esta franquicia aún no tiene inventario transferido.',
    subtotal: 'Subtotal',
    downloadPDF: 'Descargar PDF',
    storeManagement: 'Gestión de Tienda',
    franchiseStores: 'Tiendas de Franquicia',
    discountCodes: 'Códigos de Descuento',
    onlineOrders: 'Pedidos en Línea',
    customers: 'Clientes',
    configureStore: 'Configurar Tienda',
    storeSettings: 'Configuración de la Tienda',
    storeIsEnabled: 'Tienda Habilitada',
    storeName: 'Nombre de la Tienda',
    whatsappNumber: 'Número de WhatsApp',
    storeUrlSlug: 'URL de la Tienda (ej. mi-tienda)',
    pricesAndImages: 'Precios e Imágenes',
    customerPrice: 'Precio Cliente',
    productImageURL: 'URL de Imagen del Producto',
    image: 'Imagen',
    noImage: 'Sin Imagen',
    manageDiscounts: 'Gestionar Descuentos',
    addDiscountCode: 'Añadir Código',
    code: 'Código',
    type: 'Tipo',
    value: 'Valor',
    active: 'Activo',
    percentage: 'Porcentaje',
    fixed: 'Fijo',
    noDiscountCodes: 'No hay códigos de descuento.',
    customerName: 'Nombre del Cliente',
    phone: 'Teléfono',
    address: 'Dirección',
    noCustomers: 'No hay clientes registrados.',
    noOnlineOrders: 'No hay pedidos en línea.',
    orderInfo: 'Información del Pedido',
    customerInfo: 'Info. Cliente',
    viewDetails: 'Ver Detalles',
    shoppingCart: 'Carrito de Compras',
    yourCartIsEmpty: 'Tu carrito está vacío.',
    addToCart: 'Añadir al Carrito',
    checkout: 'Finalizar Pedido',
    applyDiscount: 'Aplicar Descuento',
    apply: 'Aplicar',
    discountCodePlaceholder: 'ej. VERANO20',
    invalidDiscountCode: 'Código de descuento inválido o inactivo.',
    discountApplied: 'Descuento aplicado',
    confirmOrder: 'Confirmar Pedido',
    completeYourData: 'Completa tus datos para finalizar',
    confirmOrderViaWhatsApp: 'Confirmar por WhatsApp',
    orderSummary: 'Resumen del Pedido',
    orderSuccessful: '¡Pedido Realizado!',
    weWillContactYou: 'Tu pedido ha sido enviado. Nos pondremos en contacto contigo pronto.',
    continueShopping: 'Seguir Comprando',
    outOfStock: 'Agotado',
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    total: 'Total',
    viewStore: 'Ver Tienda',
    customerDetails: 'Detalles del Cliente',
    orderHistory: 'Historial de Pedidos',
    welcomeBack: '¡Bienvenido de nuevo, {name}!',
    referralSystem: 'Sistema de Referidos',
    enableReferralSystem: 'Habilitar Sistema de Referidos',
    referrerReward: 'Recompensa para quien refiere',
    referrerRewardPlaceholder: 'ej. 1 Apreta2 Gratis en su próxima compra',
    refereeDiscount: 'Descuento para el referido',
    refereeMinPurchase: 'Compra mínima para el referido',
    referralTracking: 'Seguimiento de Referidos',
    referrer: 'Refiere',
    referee: 'Referido',
    noReferrals: 'Aún no hay referidos.',
    completed: 'Completado',
    shareAndWin: '¡Refiere a un amigo y Gana!',
    yourReferralCode: 'Tu código de referido:',
    generateMyCode: 'Generar mi Código',
    copyCode: 'Copiar Código',
    codeCopied: '¡Código copiado!',
    shareOnWhatsApp: 'Compartir en WhatsApp',
    referralDiscountApplied: '¡Descuento de referido aplicado!',
    referralCodeInvalidNewCustomer: 'Este código es solo para clientes nuevos.',
    referralCodeInvalidMinPurchase: (amount: string) => `Se requiere una compra mínima de ${amount} para usar este código.`,
    invalidReferralCode: 'Código de referido no válido.',
    pendingRewards: 'Recompensas Pendientes',
    noPendingRewards: 'No tienes recompensas pendientes.',
    redeemReward: 'Canjear Recompensa',
    youHavePendingReward: '¡Tienes una recompensa pendiente!',
    free: 'Gratis',
    itemNotAvailable: 'Artículo no disponible',
    returningCustomer: '¿Cliente recurrente? Ingresa tu teléfono',
    rewardItem: 'Artículo de Recompensa',
    rewardApplied: '¡Recompensa aplicada!',
    createNewRequest: 'Crear Nuevo Pedido',
    itemsToRequest: 'Artículos para Pedir',
    mainStock: 'Stock Principal',
    noItemsToRequestMessage: 'No hay artículos disponibles para pedir del negocio principal.',
    sendRequest: 'Enviar Pedido',
    requestHistory: 'Historial de Pedidos',
    requestPending: 'Pedido Pendiente',
    requestRejected: 'Pedido Rechazado',
    approve: 'Aprobar',
    reject: 'Rechazar',
    approveRequest: 'Aprobar Pedido',
    confirmApproval: 'Confirmar Aprobación y Transferir',
    stockCheck: 'Verificación de Stock',
    insufficientStock: 'Stock insuficiente para',
    stockAvailable: 'Disponible',
    requested: 'Solicitado',
    requestSentSuccessfully: 'Pedido enviado con éxito.',
    noRequestsMade: 'Aún no has realizado ningún pedido de inventario.',
    franchisePrice: 'Precio Franquicia',
    pleaseSetFranchisePrice: 'Por favor, defina un precio de franquicia para este artículo en la vista de Inventario.',
    requestDetails: 'Detalles del Pedido',
    birthDate: 'Fecha de Nacimiento',
    happyBirthdayMessage: '¡Feliz Cumpleaños! Hemos añadido una recompensa a tu cuenta.',
    redeemedRewardLabel: 'Recompensa Canjeada',
};


// --- SVG Icons as React Components ---
const ICONS = {
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Analytics: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/></svg>,
    Production: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 8h12"/><path d="M6 12h12"/></svg>,
    Inventory: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22.08V12"/></svg>,
    Operators: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Dispatch: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17.5" y1="6.5" x2="17.5" y2="17.5"/><line x1="6.5" y1="17.5" x2="17.5" y2="17.5"/><path d="M6 16.5v-9.3a1.5 1.5 0 0 1 1.5-1.5h7.33a1.5 1.5 0 0 1 1.2.5l3.5 4a1.5 1.5 0 0 1 0 2l-3.5 4a1.5 1.5 0 0 1-1.2.5H7.5A1.5 1.5 0 0 1 6 16.5Z"/></svg>,
    Franchises: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Store: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    Referrals: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    Requests: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    Copy: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    ShoppingCart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
    WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459l-6.273 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.451-4.437-9.885-9.888-9.885-5.451 0-9.885 4.434-9.885 9.885 0 2.021.608 4.028 1.732 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.273-.099-.471-.148-.67.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.246-.595-.492-.511-.67-.511-.173 0-.371-.025-.57-.025-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871-.118.571-.355 1.758-1.448 2.006-1.986.246-.54.246-1.002.172-1.126z"/></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
};


// --- Data Types ---
type View = 'Analytics' | 'Production' | 'Inventory' | 'Operators' | 'Dispatch' | 'Franchises' | 'Store' | 'Users' | 'Requests';

type UserRole = 'super-admin' | 'franchise-manager';

interface User {
    id: string;
    name: string;
    username: string;
    password: string; // In a real app, this would be a hash
    role: UserRole;
    franchiseId?: string; // Only for franchise-manager role
}

interface Item {
    id: string;
    name: string;
    categoryId: string;
    stock: number;
    isSellable: boolean;
    imageUrl?: string;
    franchisePrice?: number;
}

interface Category {
    id: string;
    name:string;
}

interface ProducibleItem extends Item {
    price: number;
}

interface ProductionBatch {
    id: string;
    itemId: string;
    quantity: number;
    date: string;
}

interface Operator {
    id: string;
    name: string;
}

interface DispatchItem {
    itemId: string;
    quantity: number;
    price: number;
}

interface Dispatch {
    id: string;
    operatorId: string;
    items: DispatchItem[];
    date: string;
    status: 'dispatched' | 'reconciled';
    reconciliation?: Reconciliation;
}

interface Reconciliation {
    date: string;
    items: {
        itemId: string;
        returned: number;
    }[];
    payments: {
        cash: number;
        sinpe: {
            total: number;
            transactions: number[];
        };
        other: number;
    };
}

interface Franchise {
    id: string;
    name: string;
    inventory: { itemId: string; stock: number; customerPrice?: number }[];
    storeSettings: FranchiseStoreSettings;
    operators: Operator[];
    dispatches: Dispatch[];
}

interface FranchiseStoreSettings {
    isEnabled: boolean;
    storeName: string;
    whatsappNumber: string;
    urlSlug: string;
}

type FranchiseOrderType = 'sale' | 'consignment';

type FranchiseOrderStatus = 
    | 'request-pending'
    | 'request-rejected'
    | 'pending-payment' 
    | 'paid' 
    | 'partial-payment' 
    | 'consignment-active' 
    | 'consignment-reconciled' 
    | 'consignment-partial';

interface FranchiseOrder {
    id: string;
    franchiseId: string;
    items: DispatchItem[];
    date: string;
    type: FranchiseOrderType;
    status: FranchiseOrderStatus;
    paymentDetails?: {
        cash: number;
        sinpe: {
            total: number;
            transactions: number[];
        };
        other: number;
        history: { date: string; amount: number; type: 'cash' | 'sinpe' | 'other' }[];
    };
    reconciliation?: {
        date: string;
        items: {
            itemId: string;
            returned: number;
        }[];
        payments: { // Payments made by franchise to main business
            cash: number;
            sinpe: {
                total: number;
                transactions: number[];
            };
            other: number;
        };
    };
}

interface DiscountCode {
    id: string;
    code: string;
    type: 'fixed' | 'percentage';
    value: number;
    isActive: boolean;
}

interface CartItem extends Item {
    quantity: number;
    isReward?: boolean;
    price?: number;
}

interface Customer {
    id: string; // Phone number
    name: string;
    address: string;
    pendingRewards: ReferralReward[];
    birthDate?: string; // YYYY-MM-DD
    lastBirthdayRewardYear?: number;
}

interface StoreOrder {
    id: string;
    franchiseId: string;
    customerId: string; // Phone number
    items: (Omit<CartItem, 'stock' | 'isSellable' | 'categoryId'> & { price: number })[];
    subtotal: number;
    discount: {
        code: string;
        amount: number;
    };
    total: number;
    date: string;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    redeemedRewards?: ReferralReward[];
}

interface ReferralSettings {
    enabled: boolean;
    referrerRewardItemId: string;
    refereeDiscount: number;
    refereeMinPurchase: number;
}

interface Referral {
    id: string;
    referrerId: string; // Customer ID (phone)
    refereeId: string; // Customer ID (phone)
    date: string;
    status: 'pending' | 'completed';
}

interface ReferralReward {
    id: string;
    description: string;
    itemId: string;
}


interface AppData {
    inventory: Item[];
    producibleItems: ProducibleItem[];
    categories: Category[];
    productionBatches: ProductionBatch[];
    operators: Operator[];
    dispatches: Dispatch[];
    franchises: Franchise[];
    franchiseOrders: FranchiseOrder[];
    discountCodes: DiscountCode[];
    customers: Customer[];
    storeOrders: StoreOrder[];
    referralSettings: ReferralSettings;
    referrals: Referral[];
    users: User[];
}

// --- Utility Functions ---
const formatCurrency = (amount: number, currency = 'CRC') => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency }).format(amount);
};

// --- Initial Data ---
const initialData: AppData = {
    inventory: [
        { id: 'item1', name: 'Helado de Vainilla', categoryId: 'cat1', stock: 100, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e0add?q=80&w=800', franchisePrice: 700 },
        { id: 'item2', name: 'Helado de Chocolate', categoryId: 'cat1', stock: 80, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1580982541898-583975551352?q=80&w=800', franchisePrice: 750 },
        { id: 'item3', name: 'Cono de Galleta', categoryId: 'cat2', stock: 200, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1559703248-dca749443c36?q=80&w=800', franchisePrice: 150 },
        { id: 'item4', name: 'Salsa de Caramelo', categoryId: 'cat3', stock: 50, isSellable: false, imageUrl: 'https://images.unsplash.com/photo-1542372483-32a263925585?q=80&w=800' },
        { id: 'item5', name: 'Apreta2', categoryId: 'cat1', stock: 60, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1629385994121-4d37554c6a6a?q=80&w=800', franchisePrice: 500 },
    ],
    producibleItems: [
        { id: 'item1', name: 'Helado de Vainilla', categoryId: 'cat1', stock: 100, price: 1000, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e0add?q=80&w=800', franchisePrice: 700 },
        { id: 'item2', name: 'Helado de Chocolate', categoryId: 'cat1', stock: 80, price: 1000, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1580982541898-583975551352?q=80&w=800', franchisePrice: 750 },
        { id: 'item3', name: 'Cono de Galleta', categoryId: 'cat2', stock: 200, price: 200, isSellable: true, imageUrl: 'https://images.unsplash.com/photo-1559703248-dca749443c36?q=80&w=800', franchisePrice: 150 },
    ],
    categories: [
        { id: 'cat1', name: 'Helados' },
        { id: 'cat2', name: 'Conos' },
        { id: 'cat3', name: 'Salsas' },
    ],
    productionBatches: [
        { id: 'pb1', itemId: 'item1', quantity: 50, date: new Date().toISOString() },
    ],
    operators: [
        { id: 'op1', name: 'Juan Pérez' },
        { id: 'op2', name: 'Ana Gómez' },
    ],
    dispatches: [],
    franchises: [
        {
            id: 'fran1',
            name: 'Helados del Sol',
            inventory: [
                { itemId: 'item1', stock: 20, customerPrice: 1500 },
                { itemId: 'item3', stock: 50, customerPrice: 300 },
                { itemId: 'item5', stock: 10, customerPrice: 800 },
            ],
            storeSettings: {
                isEnabled: true,
                storeName: 'Helados del Sol',
                whatsappNumber: '50688888888',
                urlSlug: 'helados-del-sol'
            },
            operators: [{ id: 'fran1-op1', name: 'Carlos Solano'}],
            dispatches: [],
        }
    ],
    franchiseOrders: [],
    discountCodes: [
        { id: 'd1', code: 'VERANO15', type: 'percentage', value: 15, isActive: true },
        { id: 'd2', code: 'AHORRA5', type: 'fixed', value: 500, isActive: true },
        { id: 'd3', code: 'INVIERNO', type: 'percentage', value: 10, isActive: false },
    ],
    customers: [
        { id: '70667750', name: 'Jorge Mata', address: '800mts Norte Liceo Unesco', pendingRewards: [{id: 'reward1', description: '1 Apreta2 Gratis en su próxima compra', itemId: 'item5'}], birthDate: '1992-08-15' },
        { id: '68789798', name: 'Cliente Fiel', address: '123 Calle Principal', pendingRewards: [], birthDate: '2000-01-20' },
    ],
    storeOrders: [],
    referralSettings: {
        enabled: true,
        referrerRewardItemId: 'item5',
        refereeDiscount: 2000,
        refereeMinPurchase: 4000,
    },
    referrals: [],
    users: [
        { id: 'user-super-admin', name: 'Admin Principal', username: 'admin', password: 'password', role: 'super-admin' },
        { id: 'user-franchise-manager', name: 'Carlos Solano', username: 'carlos', password: 'password', role: 'franchise-manager', franchiseId: 'fran1' }
    ],
};

const getFranchiseOrderStatusInfo = (orderStatus: FranchiseOrderStatus) => {
    const statuses: Record<FranchiseOrderStatus, { text: string; action?: string }> = {
        'request-pending': { text: TRANSLATIONS.requestPending, action: TRANSLATIONS.approve },
        'request-rejected': { text: TRANSLATIONS.requestRejected },
        'pending-payment': { text: TRANSLATIONS.pendingPayment, action: TRANSLATIONS.settlePayment },
        'paid': { text: TRANSLATIONS.paid, action: TRANSLATIONS.viewOrder },
        'partial-payment': { text: TRANSLATIONS.partialPayment, action: TRANSLATIONS.settlePayment },
        'consignment-active': { text: TRANSLATIONS.consignmentActive, action: TRANSLATIONS.reconcileConsignment },
        'consignment-reconciled': { text: TRANSLATIONS.consignmentReconciled, action: TRANSLATIONS.viewOrder },
        'consignment-partial': { text: TRANSLATIONS.consignmentPartial, action: TRANSLATIONS.reconcileConsignment },
    };
    return statuses[orderStatus];
};


// --- Helper Components ---

const LoadingScreen = () => (
    <div className="loading-overlay">
        <div className="spinner"></div>
        <p>{TRANSLATIONS.loadingYourBusiness}</p>
    </div>
);

const Chart = ({ data, dataKey, labelKey }: { data: any[], dataKey: string, labelKey: string }) => {
    const svgRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 250 });

    useEffect(() => {
        if (svgRef.current) {
            setDimensions({
                width: svgRef.current.clientWidth,
                height: 250,
            });
        }
    }, []);
    
    const maxValue = useMemo(() => Math.max(...data.map(d => d[dataKey] || 0)), [data, dataKey]);
    const barWidth = dimensions.width / (data.length * 2);

    return (
        <div className="chart-container" ref={svgRef}>
           {dimensions.width > 0 && (
            <svg width="100%" height={dimensions.height} >
                {data.map((d, i) => {
                    const barHeight = maxValue > 0 ? (d[dataKey] / maxValue) * (dimensions.height - 40) : 0;
                    const x = (i * 2 + 0.5) * barWidth;
                    const y = dimensions.height - barHeight - 20;
                    return (
                        <g key={i}>
                            <rect
                                className="chart-bar"
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                            />
                             <text
                                className="chart-value-label"
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                            >
                                {d[dataKey]}
                            </text>
                            <text
                                className="chart-label"
                                x={x + barWidth / 2}
                                y={dimensions.height - 5}
                                textAnchor="middle"
                            >
                                {d[labelKey]}
                            </text>
                        </g>
                    );
                })}
            </svg>
            )}
        </div>
    );
};

const SinpeCalculator = ({ transactions, onTransactionsChange }: { transactions: number[], onTransactionsChange: (tx: number[]) => void }) => {
    const [currentTx, setCurrentTx] = useState('');

    const addTransaction = () => {
        const amount = parseFloat(currentTx);
        if (!isNaN(amount) && amount > 0) {
            onTransactionsChange([...transactions, amount]);
            setCurrentTx('');
        }
    };

    const removeTransaction = (index: number) => {
        onTransactionsChange(transactions.filter((_, i) => i !== index));
    };
    
    const total = useMemo(() => transactions.reduce((sum, tx) => sum + tx, 0), [transactions]);

    return (
        <div className="sinpe-calculator">
             <div className="summary-item">
                <span>{TRANSLATIONS.totalSinpe}</span>
                <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="sinpe-input-group">
                <input
                    type="number"
                    value={currentTx}
                    onChange={(e) => setCurrentTx(e.target.value)}
                    placeholder={TRANSLATIONS.transactionAmount}
                />
                <button type="button" onClick={addTransaction}>{TRANSLATIONS.addTransaction}</button>
            </div>
           
            <div className="transaction-list-container">
                <div className="transaction-list-header">
                    <h6>{TRANSLATIONS.transactionList}</h6>
                    {transactions.length > 0 && <button type="button" className="clear-list-btn" onClick={() => onTransactionsChange([])}>{TRANSLATIONS.clearList}</button>}
                </div>
                <ul className="transaction-list">
                    {transactions.length === 0 ? <p className="empty-state">--</p> :
                        transactions.map((tx, index) => (
                            <li key={index} className="transaction-item">
                                <span>{formatCurrency(tx)}</span>
                                <button type="button" className="delete-tx-btn" onClick={() => removeTransaction(index)}>&times;</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};


// --- Views ---

const LoginView = ({ onLogin }: { onLogin: (u: string, p: string) => boolean }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onLogin(username, password)) {
            setError(TRANSLATIONS.loginFailed);
        }
    };

    return (
        <div className="login-page">
            <div className="login-form card">
                <span className="logo"><ICONS.Store /></span>
                <h2>{TRANSLATIONS.loginToYourAccount}</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">{TRANSLATIONS.Username}</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{TRANSLATIONS.Password}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="submit-btn">{TRANSLATIONS.Login}</button>
                </form>
            </div>
        </div>
    );
};

const AnalyticsView = ({ data }: { data: AppData }) => {
    const analyticsData = useMemo(() => {
        const reconciledDispatches = data.dispatches.filter(d => d.status === 'reconciled' && d.reconciliation);
        if (reconciledDispatches.length === 0) return null;

        const totalRevenue = reconciledDispatches.reduce((sum, d) => {
            const expected = d.reconciliation!.items.reduce((itemSum, item) => {
                const dispatchedItem = d.items.find(di => di.itemId === item.itemId);
                const soldQty = (dispatchedItem?.quantity ?? 0) - item.returned;
                return itemSum + (soldQty * (dispatchedItem?.price ?? 0));
            }, 0);
            return sum + expected;
        }, 0);

        const allSoldItems: { [itemId: string]: { quantity: number; revenue: number } } = {};
        const operatorPerformance: { [operatorId: string]: number } = {};

        reconciledDispatches.forEach(d => {
            const dispatchRevenue = d.reconciliation!.items.reduce((itemSum, item) => {
                const dispatchedItem = d.items.find(di => di.itemId === item.itemId);
                if (!dispatchedItem) return itemSum;

                const soldQty = dispatchedItem.quantity - item.returned;
                const revenue = soldQty * dispatchedItem.price;

                if (!allSoldItems[item.itemId]) {
                    allSoldItems[item.itemId] = { quantity: 0, revenue: 0 };
                }
                allSoldItems[item.itemId].quantity += soldQty;
                allSoldItems[item.itemId].revenue += revenue;

                return itemSum + revenue;
            }, 0);
            
            if(!operatorPerformance[d.operatorId]) operatorPerformance[d.operatorId] = 0;
            operatorPerformance[d.operatorId] += dispatchRevenue;
        });

        const totalItemsSold = Object.values(allSoldItems).reduce((sum, item) => sum + item.quantity, 0);
        
        const topSellingByRevenue = Object.entries(allSoldItems)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 5)
            .map(([itemId, itemMetrics]) => ({ name: data.inventory.find(i => i.id === itemId)?.name || 'Unknown', revenue: itemMetrics.revenue }));

        const topSellingByQuantity = Object.entries(allSoldItems)
            .sort((a, b) => b[1].quantity - a[1].quantity)
            .slice(0, 5)
            .map(([itemId, itemMetrics]) => ({ name: data.inventory.find(i => i.id === itemId)?.name || 'Unknown', quantity: itemMetrics.quantity }));

        const topOperators = Object.entries(operatorPerformance)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([operatorId, revenue]) => ({ name: data.operators.find(o => o.id === operatorId)?.name || 'Unknown', revenue }));

        return {
            totalRevenue,
            totalItemsSold,
            avgRevenuePerDispatch: totalRevenue / reconciledDispatches.length,
            totalItemsProduced: data.productionBatches.reduce((sum, batch) => sum + batch.quantity, 0),
            topSellingByRevenue,
            topSellingByQuantity,
            topOperators,
        };
    }, [data]);

    if (!analyticsData) {
        return (
            <div className="placeholder">
                <h3>{TRANSLATIONS.noAnalyticsData}</h3>
                <p>{TRANSLATIONS.reconcileToSeeReports}</p>
            </div>
        );
    }
    
    return (
      <div className="analytics-view">
        <div className="kpi-grid">
            <div className="card">
                <h3 className="card-title">{TRANSLATIONS.totalRevenue}</h3>
                <p className="card-value">{formatCurrency(analyticsData.totalRevenue)}</p>
            </div>
            <div className="card">
                <h3 className="card-title">{TRANSLATIONS.totalItemsSold}</h3>
                <p className="card-value">{analyticsData.totalItemsSold}</p>
            </div>
             <div className="card">
                <h3 className="card-title">{TRANSLATIONS.avgRevenuePerDispatch}</h3>
                <p className="card-value">{formatCurrency(analyticsData.avgRevenuePerDispatch)}</p>
            </div>
             <div className="card">
                <h3 className="card-title">{TRANSLATIONS.totalItemsProduced}</h3>
                <p className="card-value">{analyticsData.totalItemsProduced}</p>
            </div>
        </div>
        <div className="analytics-charts-grid">
             <div className="chart-card">
                <h4>{TRANSLATIONS.topSellingItemsByRevenue}</h4>
                <Chart data={analyticsData.topSellingByRevenue} dataKey="revenue" labelKey="name" />
            </div>
            <div className="chart-card">
                <h4>{TRANSLATIONS.topSellingItemsByQuantity} ({TRANSLATIONS.units})</h4>
                <Chart data={analyticsData.topSellingByQuantity} dataKey="quantity" labelKey="name" />
            </div>
             <div className="chart-card">
                <h4>{TRANSLATIONS.topOperatorPerformance}</h4>
                <Chart data={analyticsData.topOperators} dataKey="revenue" labelKey="name" />
            </div>
        </div>
      </div>
    );
};

const ProductionView = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [showManageModal, setShowManageModal] = useState(false);

    const handleRegisterProduction = () => {
        if (!selectedItem || !quantity || parseInt(quantity) <= 0) {
            alert(TRANSLATIONS.alertSelectItemAndQuantity);
            return;
        }

        const newBatch: ProductionBatch = {
            id: `pb${Date.now()}`,
            itemId: selectedItem,
            quantity: parseInt(quantity),
            date: new Date().toISOString(),
        };

        const updatedInventory = data.inventory.map(item =>
            item.id === selectedItem ? { ...item, stock: item.stock + newBatch.quantity } : item
        );
        
        const updatedProducibleItems = data.producibleItems.map(item =>
            item.id === selectedItem ? { ...item, stock: item.stock + newBatch.quantity } : item
        );

        setData({
            ...data,
            productionBatches: [newBatch, ...data.productionBatches],
            inventory: updatedInventory,
            producibleItems: updatedProducibleItems,
        });

        setSelectedItem('');
        setQuantity('');
    };

    return (
        <div className="production-view">
            <div className="card production-form">
                <div className="card-header-with-action">
                    <h3 className="card-header">{TRANSLATIONS.registerProduction}</h3>
                    <button className="manage-btn" onClick={() => setShowManageModal(true)}>{TRANSLATIONS.manageProducibleItems}</button>
                </div>
                 <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="producible-item">{TRANSLATIONS.item}</label>
                        <select id="producible-item" value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                            <option value="" disabled>--</option>
                            {data.producibleItems.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                         {data.producibleItems.length === 0 && <p className="form-helper-text">{TRANSLATIONS.noProducibleItems}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity-produced">{TRANSLATIONS.quantityProduced}</label>
                        <input type="number" id="quantity-produced" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder={TRANSLATIONS.quantityPlaceholder} min="1" />
                    </div>
                    <div className="form-group form-group-submit">
                         <button className="submit-btn" onClick={handleRegisterProduction} disabled={!selectedItem || !quantity}>{TRANSLATIONS.registerProduction}</button>
                    </div>
                </div>
            </div>
            <div className="card production-log">
                 <h3 className="card-header">{TRANSLATIONS.productionHistory}</h3>
                 <div className="table-container">
                    <table className="production-table">
                        <thead>
                            <tr>
                                <th>{TRANSLATIONS.date}</th>
                                <th>{TRANSLATIONS.item}</th>
                                <th>{TRANSLATIONS.quantity}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.productionBatches.length === 0 ? (
                                <tr><td colSpan={3} className="empty-state">{TRANSLATIONS.noProductionBatches}</td></tr>
                            ) : (
                                data.productionBatches.map(batch => (
                                    <tr key={batch.id}>
                                        <td>{new Date(batch.date).toLocaleString()}</td>
                                        <td>{data.inventory.find(i => i.id === batch.itemId)?.name || TRANSLATIONS.unknownItem}</td>
                                        <td>{batch.quantity}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
            {showManageModal && <ManageProducibleItemsModal data={data} setData={setData} onClose={() => setShowManageModal(false)} />}
        </div>
    );
};

const ManageProducibleItemsModal = ({ data, setData, onClose }: { data: AppData, setData: (d: AppData) => void, onClose: () => void }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [price, setPrice] = useState('');
    
    const availableInventory = useMemo(() => {
        const producibleIds = new Set(data.producibleItems.map(p => p.id));
        return data.inventory.filter(i => !producibleIds.has(i.id));
    }, [data.inventory, data.producibleItems]);

    const handleAddItem = () => {
        if (!selectedItem || !price || parseFloat(price) < 0) {
            alert(TRANSLATIONS.alertSelectItemAndPrice);
            return;
        }
        const itemToAdd = data.inventory.find(i => i.id === selectedItem);
        if (itemToAdd) {
            const newProducibleItem: ProducibleItem = {
                ...itemToAdd,
                price: parseFloat(price)
            };
            setData({ ...data, producibleItems: [...data.producibleItems, newProducibleItem] });
            setSelectedItem('');
            setPrice('');
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setData({ ...data, producibleItems: data.producibleItems.filter(i => i.id !== itemId) });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.manageProducibleItems}</h3>
                <div className="list-manager-body">
                    <div>
                        <h4>{TRANSLATIONS.producibleItems}</h4>
                        {data.producibleItems.length === 0 ? <p className="empty-state">{TRANSLATIONS.noItemsMarkedProducible}</p> : (
                            <ul className="managed-list">
                                {data.producibleItems.map(item => (
                                    <li key={item.id}>
                                        <span>{item.name} ({formatCurrency(item.price)})</span>
                                        <button className="delete-item-btn" onClick={() => handleDeleteItem(item.id)}><ICONS.Delete/></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                     <div>
                        <h4>{TRANSLATIONS.addItem}</h4>
                        {availableInventory.length === 0 ? <p className="empty-state">{TRANSLATIONS.allInvetoryIsProducible}</p> : (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{TRANSLATIONS.item}</label>
                                    <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                                        <option value="" disabled>--</option>
                                        {availableInventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{TRANSLATIONS.price}</label>
                                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={TRANSLATIONS.pricePlaceholder} min="0"/>
                                </div>
                                <div className="form-group form-group-submit">
                                    <button className="submit-btn" onClick={handleAddItem}>{TRANSLATIONS.add}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const InventoryView = ({ data, setData, context }: { data: AppData, setData: (d: AppData) => void, context: string }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [isSellable, setIsSellable] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    
    const isFranchiseContext = context !== 'main';
    const franchise = useMemo(() => isFranchiseContext ? data.franchises.find(f => f.id === context) : null, [data, context, isFranchiseContext]);

    const [localInventory, setLocalInventory] = useState(franchise?.inventory ?? []);

    useEffect(() => {
        if (isFranchiseContext) {
            setLocalInventory(franchise?.inventory ?? []);
        }
    }, [franchise?.inventory, isFranchiseContext]);

    useEffect(() => {
        // Set a default category if one exists and none is selected
        if (!newItemCategory && data.categories.length > 0) {
            setNewItemCategory(data.categories[0].id);
        }
    }, [data.categories, newItemCategory]);

    const handleAddItem = () => {
        if (!newItemName.trim() || !newItemCategory) {
            alert(TRANSLATIONS.alertProvideItemNameAndCategory);
            return;
        }

        const newItem: Item = {
            id: `item${Date.now()}`,
            name: newItemName.trim(),
            categoryId: newItemCategory,
            stock: 0,
            isSellable,
            imageUrl,
            franchisePrice: 0,
        };

        setData({ ...data, inventory: [...data.inventory, newItem] });
        setNewItemName('');
        setIsSellable(true);
        setImageUrl('');
        if (data.categories.length > 0) setNewItemCategory(data.categories[0].id);
    };

    const handleDeleteItem = (itemId: string) => {
        // Check if item is in use
        const isInProduction = data.producibleItems.some(p => p.id === itemId);
        const isInDispatch = data.dispatches.some(d => d.items.some(i => i.itemId === itemId));
        const isInFranchiseOrders = data.franchiseOrders.some(d => d.items.some(i => i.itemId === itemId));
        
        if (isInProduction || isInDispatch || isInFranchiseOrders) {
            alert(TRANSLATIONS.cannotDeleteItemInUse);
            return;
        }

        if (window.confirm(TRANSLATIONS.confirmDeleteItem)) {
            const updatedInventory = data.inventory.filter(i => i.id !== itemId);
            const updatedProducible = data.producibleItems.filter(p => p.id !== itemId);
            setData({ ...data, inventory: updatedInventory, producibleItems: updatedProducible });
        }
    };

    const handleFranchisePriceChange = (itemId: string, newPrice: number | undefined) => {
        const updatedInventory = data.inventory.map(item =>
            item.id === itemId ? { ...item, franchisePrice: newPrice } : item
        );
         const updatedProducibleItems = data.producibleItems.map(pItem => {
            const updatedItem = updatedInventory.find(i => i.id === pItem.id);
            if (updatedItem) {
                // Keep existing customer price from producible item, but sync other props
                 const { price, ...restOfProducible } = pItem;
                 const { franchisePrice, ...restOfInventory } = updatedItem;
                return { ...restOfProducible, ...restOfInventory, price, franchisePrice };
            }
            return pItem;
        });
        setData({ ...data, inventory: updatedInventory, producibleItems: updatedProducibleItems });
    };

    // Franchise-specific handlers
    const handleStockChange = (itemId: string, newStock: number) => {
        setLocalInventory(localInventory.map(item => item.itemId === itemId ? { ...item, stock: newStock } : item));
    };
    
    const handlePriceChange = (itemId: string, newPrice: number) => {
        setLocalInventory(localInventory.map(item => item.itemId === itemId ? { ...item, customerPrice: newPrice } : item));
    };

    const handleSaveChanges = () => {
        setData({
            ...data,
            franchises: data.franchises.map(f => f.id === context ? { ...f, inventory: localInventory } : f),
        });
        alert('Cambios guardados');
    };

    if (isFranchiseContext) {
         if (!franchise) return <p>Franchise not found</p>;

         return (
             <div className="franchise-inventory-view">
                 <div className="card">
                     <div className="card-header-with-action">
                         <h3 className="card-header">{TRANSLATIONS.franchiseInventoryTitleFor(franchise.name)}</h3>
                         <button className="submit-btn" onClick={handleSaveChanges}>{TRANSLATIONS.saveChanges}</button>
                     </div>

                     <div className="table-container">
                         <table className="inventory-table">
                             <thead>
                                 <tr>
                                     <th>{TRANSLATIONS.name}</th>
                                     <th>{TRANSLATIONS.stock}</th>
                                     <th>{TRANSLATIONS.customerPrice}</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {localInventory.length === 0 ? (
                                     <tr><td colSpan={3} className="empty-state">{TRANSLATIONS.franchiseHasNoInventory}</td></tr>
                                 ) : (
                                     localInventory.map(invItem => {
                                         const mainItem = data.inventory.find(i => i.id === invItem.itemId);
                                         if (!mainItem) return null;
                                         return (
                                             <tr key={invItem.itemId}>
                                                 <td>{mainItem.name}</td>
                                                 <td>
                                                     <input
                                                         type="number"
                                                         className="item-input"
                                                         value={invItem.stock}
                                                         onChange={e => handleStockChange(invItem.itemId, parseInt(e.target.value) || 0)}
                                                         min="0"
                                                     />
                                                 </td>
                                                  <td>
                                                     <input
                                                         type="number"
                                                         className="item-input"
                                                         value={invItem.customerPrice ?? ''}
                                                         onChange={e => handlePriceChange(invItem.itemId, parseFloat(e.target.value) || 0)}
                                                         min="0"
                                                         placeholder={TRANSLATIONS.pricePlaceholder}
                                                     />
                                                 </td>
                                             </tr>
                                         );
                                     })
                                 )}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
         );
    }
    
    return (
        <div className="inventory-view">
            <div className="card add-item-form">
                <div className="card-header-with-action">
                    <h3 className="card-header">{TRANSLATIONS.addNewInventoryItem}</h3>
                    <button className="manage-btn" onClick={() => setShowCategoryModal(true)}>{TRANSLATIONS.manageCategories}</button>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="item-name">{TRANSLATIONS.itemName}</label>
                        <input type="text" id="item-name" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder={TRANSLATIONS.vanillaBeanPlaceholder}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-category">{TRANSLATIONS.category}</label>
                        <select id="item-category" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} disabled={data.categories.length === 0}>
                            <option value="" disabled>--</option>
                            {data.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {data.categories.length === 0 && <p className="form-helper-text">{TRANSLATIONS.pleaseAddCategoryFirst}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="item-image-url">{TRANSLATIONS.productImageURL}</label>
                        <input type="url" id="item-image-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..."/>
                    </div>
                     <div className="form-group">
                        <label>{TRANSLATIONS.sellable}</label>
                         <div className="form-group-toggle" style={{padding:'0.5rem 1rem', marginBottom: 0}}>
                            <label htmlFor="is-sellable">{isSellable ? TRANSLATIONS.yes : TRANSLATIONS.no}</label>
                            <label className="switch">
                                <input id="is-sellable" type="checkbox" checked={isSellable} onChange={e => setIsSellable(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group form-group-submit">
                         <button className="submit-btn" onClick={handleAddItem}>{TRANSLATIONS.addItem}</button>
                    </div>
                </div>
            </div>
            <div className="card current-stock">
                <h3 className="card-header">{TRANSLATIONS.currentStock}</h3>
                <div className="table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>{TRANSLATIONS.image}</th>
                                <th>{TRANSLATIONS.name}</th>
                                <th>{TRANSLATIONS.category}</th>
                                <th>{TRANSLATIONS.stock}</th>
                                <th>{TRANSLATIONS.franchisePrice}</th>
                                <th>{TRANSLATIONS.sellable}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.inventory.length === 0 ? (
                                <tr><td colSpan={7} className="empty-state">{TRANSLATIONS.noInventoryItems}</td></tr>
                            ) : (
                                data.inventory.map(item => (
                                <tr key={item.id}>
                                    <td>
                                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="item-image-thumbnail" /> : <div className="item-image-thumbnail"></div>}
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{data.categories.find(c => c.id === item.categoryId)?.name || TRANSLATIONS.uncategorized}</td>
                                    <td>{item.stock}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="item-input"
                                            style={{maxWidth: '120px'}}
                                            value={item.franchisePrice ?? ''}
                                            onChange={(e) => handleFranchisePriceChange(item.id, e.target.value ? parseFloat(e.target.value) : undefined)}
                                            placeholder="0.00"
                                            min="0"
                                        />
                                    </td>
                                    <td><span className={`status-badge ${item.isSellable ? 'reconciled' : 'cancelled'}`}>{item.isSellable ? TRANSLATIONS.yes : TRANSLATIONS.no}</span></td>
                                    <td>
                                        <button className="table-action-btn delete" onClick={() => handleDeleteItem(item.id)} title={TRANSLATIONS.deleteItem}>
                                            <ICONS.Delete />
                                        </button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCategoryModal && <ManageCategoriesModal data={data} setData={setData} onClose={() => setShowCategoryModal(false)}/>}
        </div>
    );
};

const ManageCategoriesModal = ({ data, setData, onClose }: { data: AppData, setData: (d: AppData) => void, onClose: () => void }) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCategory: Category = {
            id: `cat${Date.now()}`,
            name: newCategoryName.trim(),
        };
        setData({ ...data, categories: [...data.categories, newCategory] });
        setNewCategoryName('');
    };

    const handleDeleteCategory = (categoryId: string) => {
        const isUsed = data.inventory.some(item => item.categoryId === categoryId);
        if(isUsed) {
            alert(TRANSLATIONS.cannotDeleteCategoryInUse);
            return;
        }
        setData({ ...data, categories: data.categories.filter(c => c.id !== categoryId) });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.manageCategories}</h3>
                <div className="list-manager-body">
                    <div>
                        <h4>{TRANSLATIONS.categories}</h4>
                        {data.categories.length === 0 ? <p className="empty-state">{TRANSLATIONS.noCategoriesDefined}</p> : (
                            <ul className="managed-list">
                                {data.categories.map(cat => (
                                    <li key={cat.id}>
                                        <span>{cat.name}</span>
                                        <button className="delete-item-btn" onClick={() => handleDeleteCategory(cat.id)}><ICONS.Delete/></button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                     <div>
                        <h4>{TRANSLATIONS.add}</h4>
                        <div className="add-item-to-list-form">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder={TRANSLATIONS.newCategoryNamePlaceholder}
                            />
                            <button className="submit-btn" onClick={handleAddCategory}>{TRANSLATIONS.add}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OperatorsView = ({ data, setData, context }: { data: AppData, setData: (d: AppData) => void, context: string }) => {
    const [newOperatorName, setNewOperatorName] = useState('');
    const isFranchiseContext = context !== 'main';
    const currentFranchise = useMemo(() => isFranchiseContext ? data.franchises.find(f => f.id === context) : null, [data, context, isFranchiseContext]);
    const operators = isFranchiseContext ? currentFranchise?.operators ?? [] : data.operators;
    
    const handleAddOperator = () => {
        if (!newOperatorName.trim()) return;
        const newOperator: Operator = {
            id: `${isFranchiseContext ? context : 'op'}${Date.now()}`,
            name: newOperatorName.trim(),
        };

        if (isFranchiseContext) {
            setData({
                ...data,
                franchises: data.franchises.map(f =>
                    f.id === context ? { ...f, operators: [...(f.operators ?? []), newOperator] } : f
                ),
            });
        } else {
            setData({ ...data, operators: [...data.operators, newOperator] });
        }
        setNewOperatorName('');
    };

    const handleDeleteOperator = (operatorId: string) => {
        if (isFranchiseContext) {
            const isUsed = currentFranchise?.dispatches.some(d => d.operatorId === operatorId);
             if (isUsed) {
                alert(TRANSLATIONS.cannotDeleteOperatorInUse);
                return;
            }
            setData({
                ...data,
                franchises: data.franchises.map(f =>
                    f.id === context ? { ...f, operators: f.operators.filter(op => op.id !== operatorId) } : f
                ),
            });
        } else {
            const isUsed = data.dispatches.some(d => d.operatorId === operatorId);
            if (isUsed) {
                alert(TRANSLATIONS.cannotDeleteOperatorInUse);
                return;
            }
            setData({ ...data, operators: data.operators.filter(op => op.id !== operatorId) });
        }
    };
    
    const title = isFranchiseContext ? TRANSLATIONS.manageOperatorsFor(currentFranchise?.name ?? '') : TRANSLATIONS.manageOperators;

    return (
        <div className="operators-view">
            <div className="card operator-list">
                <h3 className="card-header">{title}</h3>
                <div className="add-item-to-list-form" style={{marginBottom: '1.5rem'}}>
                    <input
                        type="text"
                        value={newOperatorName}
                        onChange={e => setNewOperatorName(e.target.value)}
                        placeholder={TRANSLATIONS.newOperatorNamePlaceholder}
                    />
                    <button className="submit-btn" onClick={handleAddOperator}>{TRANSLATIONS.addOperator}</button>
                </div>
                <div className="table-container">
                    <table className="operators-table">
                         <thead>
                            <tr>
                                <th>{TRANSLATIONS.name}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operators.length === 0 ? (
                                <tr><td colSpan={2} className="empty-state">{TRANSLATIONS.noOperatorsAdded}</td></tr>
                            ) : (
                                operators.map(op => (
                                    <tr key={op.id}>
                                        <td>{op.name}</td>
                                        <td>
                                            <button className="table-action-btn delete" onClick={() => handleDeleteOperator(op.id)}>
                                                <ICONS.Delete/> {TRANSLATIONS.delete}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const DispatchView = ({ data, setData, context }: { data: AppData, setData: (d: AppData) => void, context: string }) => {
    const [selectedOperator, setSelectedOperator] = useState('');
    const [dispatchItems, setDispatchItems] = useState<DispatchItem[]>([]);
    const [showReconcileModal, setShowReconcileModal] = useState<Dispatch | null>(null);
    const [creating, setCreating] = useState(false);

    const isFranchiseContext = context !== 'main';
    const currentFranchise = useMemo(() => isFranchiseContext ? data.franchises.find(f => f.id === context) : null, [data, context, isFranchiseContext]);

    const availableOperators = isFranchiseContext ? currentFranchise?.operators ?? [] : data.operators;
    const dispatchHistory = isFranchiseContext ? currentFranchise?.dispatches ?? [] : data.dispatches;

    const dispatchableItems = useMemo(() => {
        if (!isFranchiseContext) {
            return data.producibleItems;
        }
        if (!currentFranchise) return [];
        
        return currentFranchise.inventory
            .map(franchiseInv => {
                const mainItem = data.inventory.find(i => i.id === franchiseInv.itemId);
                if (!mainItem || !mainItem.isSellable) return null;
                return {
                    ...mainItem,
                    stock: franchiseInv.stock,
                    price: franchiseInv.customerPrice ?? 0,
                };
            })
            .filter(item => item !== null && item.stock > 0 && item.price > 0) as ProducibleItem[];
    }, [data, isFranchiseContext, currentFranchise]);

    const handleAddItemToDispatch = (item: ProducibleItem, quantity: number) => {
        const existingItem = dispatchItems.find(i => i.itemId === item.id);
        const itemInContext = dispatchableItems.find(i => i.id === item.id);
        const currentStock = itemInContext?.stock ?? 0;
        const quantityInCart = existingItem?.quantity ?? 0;

        if (quantity > currentStock - quantityInCart) {
            alert(TRANSLATIONS.alertCannotAddStock(quantity, currentStock - quantityInCart));
            return;
        }

        if (existingItem) {
            setDispatchItems(dispatchItems.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i));
        } else {
            setDispatchItems([...dispatchItems, { itemId: item.id, quantity, price: item.price }]);
        }
    };

    const updateItemInDispatch = (itemId: string, newQuantity: number, newPrice: number) => {
        const itemInContext = dispatchableItems.find(i => i.id === itemId);
        const itemStock = itemInContext?.stock ?? 0;
        if (newQuantity > itemStock) {
            newQuantity = itemStock;
            alert(TRANSLATIONS.alertWarningStock(itemStock, itemInContext?.name ?? ''));
        }
        if (newQuantity <= 0) {
            setDispatchItems(dispatchItems.filter(i => i.itemId !== itemId));
        } else {
            setDispatchItems(dispatchItems.map(i => i.itemId === itemId ? { ...i, quantity: newQuantity, price: newPrice } : i));
        }
    };
    
    const handleCreateDispatch = () => {
        if (!selectedOperator || dispatchItems.length === 0) {
            alert(TRANSLATIONS.alertSelectOperatorAndItems);
            return;
        }
        setCreating(true);

        const newDispatch: Dispatch = {
            id: `d${Date.now()}`,
            operatorId: selectedOperator,
            items: dispatchItems,
            date: new Date().toISOString(),
            status: 'dispatched',
        };

        if (isFranchiseContext) {
             const updatedFranchises = data.franchises.map(f => {
                if (f.id === context) {
                    const updatedInventory = f.inventory.map(invItem => {
                        const dispatchItem = dispatchItems.find(dItem => dItem.itemId === invItem.itemId);
                        return dispatchItem ? { ...invItem, stock: invItem.stock - dispatchItem.quantity } : invItem;
                    });
                    return { ...f, dispatches: [newDispatch, ...f.dispatches], inventory: updatedInventory };
                }
                return f;
             });
             setData({ ...data, franchises: updatedFranchises });
        } else {
            const updatedInventory = data.inventory.map(invItem => {
                const dispatchItem = dispatchItems.find(dItem => dItem.itemId === invItem.id);
                return dispatchItem ? { ...invItem, stock: invItem.stock - dispatchItem.quantity } : invItem;
            });
            setData({ ...data, dispatches: [newDispatch, ...data.dispatches], inventory: updatedInventory });
        }

        setTimeout(() => {
            setDispatchItems([]);
            setSelectedOperator('');
            setCreating(false);
        }, 500);
    };
    
    const handleDuplicateDispatch = (dispatchToCopy: Dispatch) => {
        const operatorExists = availableOperators.some(o => o.id === dispatchToCopy.operatorId);
        if (!operatorExists) {
            alert(TRANSLATIONS.alertOperatorNotFound);
            return;
        }
        
        for (const item of dispatchToCopy.items) {
            const stockItem = dispatchableItems.find(i => i.id === item.itemId);
            if (!stockItem || stockItem.stock < item.quantity) {
                alert(`No hay suficiente stock de "${stockItem?.name}" para duplicar. Se necesitan ${item.quantity} y solo hay ${stockItem?.stock} disponibles.`);
                return;
            }
        }

        setSelectedOperator(dispatchToCopy.operatorId);
        setDispatchItems(dispatchToCopy.items);
        window.scrollTo(0, 0);
    }

    return (
        <div className="dispatch-view">
            <div className="card">
                <h3 className="card-header">{TRANSLATIONS.createNewDispatch}</h3>
                <div className="form-grid">
                     <div className="form-group">
                        <label>{TRANSLATIONS.operator}</label>
                         <select value={selectedOperator} onChange={e => setSelectedOperator(e.target.value)} disabled={availableOperators.length === 0}>
                            <option value="" disabled>--</option>
                            {availableOperators.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                        </select>
                         {availableOperators.length === 0 && <p className="form-helper-text">{TRANSLATIONS.pleaseAddOperator}</p>}
                    </div>
                </div>

                <AddItemToDispatchForm
                    dispatchableItems={dispatchableItems}
                    onAddItem={handleAddItemToDispatch}
                />

                {dispatchItems.length === 0 ? (
                     <p className="empty-state">{TRANSLATIONS.noItemsInDispatch}</p>
                ) : (
                    <div className="dispatch-item-editor-list">
                        <div className="dispatch-item-editor-header">
                           <span>{TRANSLATIONS.item}</span>
                           <span>{TRANSLATIONS.quantity}</span>
                           <span>{TRANSLATIONS.price}</span>
                           <span></span>
                        </div>
                        {dispatchItems.map(item => {
                            const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                            return (
                                <div key={item.itemId} className="dispatch-item-editor-row">
                                    <span className="item-name">{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</span>
                                    <input
                                        type="number"
                                        className="item-input"
                                        value={item.quantity}
                                        onChange={(e) => updateItemInDispatch(item.itemId, parseInt(e.target.value) || 0, item.price)}
                                        min="0"
                                    />
                                    <input
                                        type="number"
                                        className="item-input"
                                        value={item.price}
                                        onChange={(e) => updateItemInDispatch(item.itemId, item.quantity, parseFloat(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <button className="delete-item-btn" onClick={() => updateItemInDispatch(item.itemId, 0, 0)}>
                                        <ICONS.Delete />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}


                <button className="submit-btn" onClick={handleCreateDispatch} disabled={creating || !selectedOperator || dispatchItems.length === 0}>
                    {creating ? TRANSLATIONS.creating : TRANSLATIONS.createDispatch}
                </button>
            </div>
            <div className="card dispatch-list">
                 <h3 className="card-header">{TRANSLATIONS.dispatchHistory}</h3>
                 <div className="table-container">
                    <table className="dispatch-table">
                         <thead>
                            <tr>
                                <th>{TRANSLATIONS.date}</th>
                                <th>{TRANSLATIONS.operator}</th>
                                <th>{TRANSLATIONS.items}</th>
                                <th>{TRANSLATIONS.status}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                         <tbody>
                            {dispatchHistory.length === 0 ? (
                                <tr><td colSpan={5} className="empty-state">{TRANSLATIONS.noDispatchesCreated}</td></tr>
                            ) : (
                                dispatchHistory.map(dispatch => (
                                    <tr key={dispatch.id}>
                                        <td>{new Date(dispatch.date).toLocaleDateString()}</td>
                                        <td>{availableOperators.find(o => o.id === dispatch.operatorId)?.name || 'N/A'}</td>
                                        <td>{dispatch.items?.length ?? 0}</td>
                                        <td><span className={`status-badge ${dispatch.status}`}>{TRANSLATIONS[dispatch.status]}</span></td>
                                        <td className="table-actions">
                                            {dispatch.status === 'dispatched' && 
                                                <button className="table-action-btn reconcile" onClick={() => setShowReconcileModal(dispatch)}>{TRANSLATIONS.reconcile}</button>
                                            }
                                            {dispatch.status === 'reconciled' &&
                                                <button className="table-action-btn view" onClick={() => setShowReconcileModal(dispatch)}>{TRANSLATIONS.view}</button>
                                            }
                                            <button className="table-action-btn copy" onClick={() => handleDuplicateDispatch(dispatch)} title={TRANSLATIONS.duplicateDispatch}>
                                                <ICONS.Copy />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
            {showReconcileModal && 
                <ReconciliationModal 
                    dispatch={showReconcileModal} 
                    data={data}
                    setData={setData}
                    onClose={() => setShowReconcileModal(null)}
                    context={context}
                />
            }
        </div>
    );
};

const AddItemToDispatchForm = ({ dispatchableItems, onAddItem }: { dispatchableItems: (Item & { price?: number })[], onAddItem: (item: any, quantity: number) => void }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('1');
    const selectedItemDetails = useMemo(() => dispatchableItems.find(i => i.id === selectedItem), [dispatchableItems, selectedItem]);
    const stock = useMemo(() => selectedItemDetails?.stock ?? 0, [selectedItemDetails]);

    const handleAddClick = () => {
        if (selectedItemDetails && parseInt(quantity) > 0) {
            onAddItem(selectedItemDetails, parseInt(quantity));
            setSelectedItem('');
            setQuantity('1');
        }
    };
    
    return (
        <div className="add-item-to-dispatch-form">
            <div className="form-group">
                <label>{TRANSLATIONS.item}</label>
                <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                    <option value="" disabled>--</option>
                    {dispatchableItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>{TRANSLATIONS.quantity}</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" max={stock} disabled={!selectedItem}/>
                {selectedItem && <p className="form-helper-text">{stock} {TRANSLATIONS.inStock}</p>}
            </div>
            <div className="form-group">
                <button className="submit-btn" onClick={handleAddClick} disabled={!selectedItem || parseInt(quantity) > stock || stock <= 0}>{TRANSLATIONS.add}</button>
            </div>
        </div>
    );
}

const ReconciliationModal = ({ dispatch, data, setData, onClose, context }: { dispatch: Dispatch, data: AppData, setData: (d: AppData) => void, onClose: () => void, context: string }) => {
    const isReadOnly = dispatch.status === 'reconciled';
    const initialReturns = useMemo(() => 
        dispatch.items?.map(item => ({ itemId: item.itemId, returned: dispatch.reconciliation?.items.find(r => r.itemId === item.itemId)?.returned ?? 0 })) ?? [],
        [dispatch]
    );
    const [returnedItems, setReturnedItems] = useState(initialReturns);
    const [payments, setPayments] = useState(dispatch.reconciliation?.payments ?? { cash: 0, sinpe: { total: 0, transactions: [] }, other: 0 });
    const isFranchiseContext = context !== 'main';

    const handleReturnChange = (itemId: string, value: number) => {
        const dispatchItem = dispatch.items.find(i => i.itemId === itemId);
        const maxReturns = dispatchItem?.quantity ?? 0;
        const newReturned = Math.max(0, Math.min(maxReturns, value));
        setReturnedItems(returnedItems.map(item => item.itemId === itemId ? { ...item, returned: newReturned } : item));
    };

    const financialSummary = useMemo(() => {
        const expectedRevenue = dispatch.items?.reduce((total, item) => {
            const returnedQty = returnedItems?.find(r => r.itemId === item.itemId)?.returned ?? 0;
            const soldQty = item.quantity - returnedQty;
            return total + (soldQty * item.price);
        }, 0) ?? 0;
        
        const totalPaid = payments.cash + payments.sinpe.total + payments.other;
        const discrepancy = totalPaid - expectedRevenue;

        return { expectedRevenue, totalPaid, discrepancy };
    }, [dispatch.items, returnedItems, payments]);

    const handleSave = () => {
        const newReconciliation: Reconciliation = {
            date: new Date().toISOString(),
            items: returnedItems,
            payments,
        };

        if (isFranchiseContext) {
            const updatedFranchises = data.franchises.map(f => {
                if (f.id === context) {
                    // Update this franchise's dispatches
                    const updatedDispatches = f.dispatches.map(d => 
                        d.id === dispatch.id ? { ...d, status: 'reconciled' as const, reconciliation: newReconciliation } : d
                    );
                    // Update this franchise's inventory
                    const updatedInventory = f.inventory.map(invItem => {
                        const returned = returnedItems.find(r => r.itemId === invItem.itemId);
                        return returned ? { ...invItem, stock: invItem.stock + returned.returned } : invItem;
                    });
                    return { ...f, dispatches: updatedDispatches, inventory: updatedInventory };
                }
                return f;
            });
            setData({ ...data, franchises: updatedFranchises });
        } else {
             const updatedDispatches = data.dispatches.map(d => 
                d.id === dispatch.id ? { ...d, status: 'reconciled' as const, reconciliation: newReconciliation } : d
            );
            const updatedInventory = data.inventory.map(invItem => {
                const returned = returnedItems.find(r => r.itemId === invItem.id);
                return returned ? { ...invItem, stock: invItem.stock + returned.returned } : invItem;
            });
            setData({ ...data, dispatches: updatedDispatches, inventory: updatedInventory });
        }
        onClose();
    };

    const handleSinpeChange = (transactions: number[]) => {
        const total = transactions.reduce((sum, tx) => sum + tx, 0);
        setPayments(p => ({ ...p, sinpe: { total, transactions } }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{isReadOnly ? TRANSLATIONS.viewReconciliation : TRANSLATIONS.reconcileDispatch}</h3>
                <p className="modal-subtitle">{TRANSLATIONS.dispatchId}: {dispatch.id}</p>
                
                <div className="reconciliation-body">
                    <div>
                        <h4>{TRANSLATIONS.itemsSummary}</h4>
                        <table className="reconciliation-table">
                            <thead>
                                <tr>
                                    <th>{TRANSLATIONS.item}</th>
                                    <th>{TRANSLATIONS.dispatchedQty}</th>
                                    <th>{TRANSLATIONS.returned}</th>
                                    <th>{TRANSLATIONS.sold}</th>
                                    <th>{TRANSLATIONS.revenue}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dispatch.items ?? []).map(item => {
                                    const returnedQty = returnedItems.find(r => r.itemId === item.itemId)?.returned ?? 0;
                                    const soldQty = item.quantity - returnedQty;
                                    const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                                    return (
                                        <tr key={item.itemId}>
                                            <td>{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={returnedQty} 
                                                    onChange={e => handleReturnChange(item.itemId, parseInt(e.target.value) || 0)} 
                                                    disabled={isReadOnly}
                                                    max={item.quantity}
                                                    min={0}
                                                />
                                            </td>
                                            <td>{soldQty}</td>
                                            <td>{formatCurrency(soldQty * item.price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="reconciliation-financials">
                        <div className="payment-inputs">
                            <h4>{TRANSLATIONS.paymentsReceived}</h4>
                            <div className="form-group">
                                <label>{TRANSLATIONS.cashPayment}</label>
                                <input type="number" value={payments.cash} onChange={e => setPayments({...payments, cash: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                             <div className="form-group">
                                <label>{TRANSLATIONS.otherPayment}</label>
                                <input type="number" value={payments.other} onChange={e => setPayments({...payments, other: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                            <SinpeCalculator transactions={payments.sinpe.transactions} onTransactionsChange={handleSinpeChange} />
                        </div>
                        <div className="financial-summary-section">
                             <h4>{TRANSLATIONS.financialSummary}</h4>
                             <div className="financial-summary">
                                 <div className="summary-item">
                                    <span>{TRANSLATIONS.expectedRevenue}</span>
                                    <strong>{formatCurrency(financialSummary.expectedRevenue)}</strong>
                                 </div>
                                 <div className="summary-item">
                                    <span>{TRANSLATIONS.totalPaid}</span>
                                    <strong>{formatCurrency(financialSummary.totalPaid)}</strong>
                                 </div>
                                 <div className={`summary-item discrepancy ${financialSummary.discrepancy < 0 ? 'short' : 'over'}`}>
                                    <span>{TRANSLATIONS.discrepancy}</span>
                                    <strong>{formatCurrency(financialSummary.discrepancy)}</strong>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {!isReadOnly && <button className="submit-btn" style={{marginTop: '2rem'}} onClick={handleSave}>{TRANSLATIONS.saveReconciliation}</button>}
            </div>
        </div>
    );
};


const FranchisesView = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
    const [newFranchiseName, setNewFranchiseName] = useState('');
    const [showTransferModal, setShowTransferModal] = useState<Franchise | null>(null);
    const [orderToDuplicate, setOrderToDuplicate] = useState<FranchiseOrder | null>(null);

    const handleDuplicateRequest = (orderToCopy: FranchiseOrder) => {
        for (const item of orderToCopy.items) {
            const stockItem = data.inventory.find(i => i.id === item.itemId);
            if (!stockItem || stockItem.stock < item.quantity) {
                 alert(`No hay suficiente stock de "${stockItem?.name}" para duplicar el pedido. Se necesitan ${item.quantity} y solo hay ${stockItem?.stock} disponibles.`);
                return;
            }
        }

        const franchise = data.franchises.find(f => f.id === orderToCopy.franchiseId);
        if (franchise) {
            setOrderToDuplicate(orderToCopy);
            setShowTransferModal(franchise);
        } else {
            alert("La franquicia para este pedido ya no existe.");
        }
    };

    const handleCloseTransferModal = () => {
        setShowTransferModal(null);
        setOrderToDuplicate(null);
    };

    const handleAddFranchise = () => {
        if (!newFranchiseName.trim()) return;
        const newFranchise: Franchise = {
            id: `fran${Date.now()}`,
            name: newFranchiseName.trim(),
            inventory: [],
            storeSettings: {
                isEnabled: false,
                storeName: newFranchiseName.trim(),
                whatsappNumber: '',
                urlSlug: newFranchiseName.trim().toLowerCase().replace(/\s+/g, '-')
            },
            operators: [],
            dispatches: [],
        };
        setData({ ...data, franchises: [...data.franchises, newFranchise] });
        setNewFranchiseName('');
    };

    const handleDeleteFranchise = (franchiseId: string) => {
        const franchise = data.franchises.find(f => f.id === franchiseId);
        if (franchise && (franchise.inventory.length > 0 || data.franchiseOrders.some(o => o.franchiseId === franchiseId))) {
            alert(TRANSLATIONS.cannotDeleteFranchiseInUse);
            return;
        }
        setData({ ...data, franchises: data.franchises.filter(f => f.id !== franchiseId) });
    };

    return (
        <div className="franchises-view">
            <div className="card">
                <h3 className="card-header">{TRANSLATIONS.manageFranchises}</h3>
                 <div className="add-item-to-list-form" style={{marginBottom: '1.5rem'}}>
                    <input
                        type="text"
                        value={newFranchiseName}
                        onChange={e => setNewFranchiseName(e.target.value)}
                        placeholder={TRANSLATIONS.newFranchiseNamePlaceholder}
                    />
                    <button className="submit-btn" onClick={handleAddFranchise}>{TRANSLATIONS.addFranchise}</button>
                </div>
                <div className="table-container">
                    <table className="operators-table">
                        <thead>
                            <tr>
                                <th>{TRANSLATIONS.name}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                             {data.franchises.length === 0 ? (
                                <tr><td colSpan={2} className="empty-state">{TRANSLATIONS.noFranchisesAdded}</td></tr>
                            ) : (
                                data.franchises.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.name}</td>
                                        <td className="table-actions">
                                            <button className="table-action-btn reconcile" onClick={() => setShowTransferModal(f)}>{TRANSLATIONS.transferInventory}</button>
                                            <button className="table-action-btn delete" onClick={() => handleDeleteFranchise(f.id)}><ICONS.Delete /></button>
                                        </td>
                                    </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <FranchiseOrdersCard data={data} setData={setData} onDuplicateOrder={handleDuplicateRequest} />

            {showTransferModal && <TransferInventoryModal data={data} setData={setData} franchise={showTransferModal} onClose={handleCloseTransferModal} orderToDuplicate={orderToDuplicate} />}
        </div>
    );
};

const TransferInventoryModal = ({ data, setData, franchise, onClose, orderToDuplicate }: { data: AppData, setData: (d: AppData) => void, franchise: Franchise, onClose: () => void, orderToDuplicate?: FranchiseOrder | null }) => {
    const [transferItems, setTransferItems] = useState<DispatchItem[]>(() => orderToDuplicate?.items ?? []);
    const [orderType, setOrderType] = useState<FranchiseOrderType>(() => orderToDuplicate?.type ?? 'sale');
    const [creating, setCreating] = useState(false);

    const handleAddItem = (item: Item, quantity: number) => {
        if (item.franchisePrice === undefined) {
            alert(TRANSLATIONS.pleaseSetFranchisePrice);
            return;
        }
        const price = item.franchisePrice;

        const existingItem = transferItems.find(i => i.itemId === item.id);
        const currentStock = data.inventory.find(i => i.id === item.id)?.stock ?? 0;
        const quantityInCart = existingItem?.quantity ?? 0;

        if (quantity > currentStock - quantityInCart) {
            alert(TRANSLATIONS.alertCannotAddStock(quantity, currentStock - quantityInCart));
            return;
        }

        if (existingItem) {
            setTransferItems(transferItems.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i));
        } else {
            setTransferItems([...transferItems, { itemId: item.id, quantity, price }]);
        }
    };

    const updateItemInTransfer = (itemId: string, newQuantity: number, newPrice: number) => {
        const itemStock = data.inventory.find(i => i.id === itemId)?.stock ?? 0;
        if (newQuantity > itemStock) {
            newQuantity = itemStock;
            alert(TRANSLATIONS.alertWarningStock(itemStock, data.inventory.find(i => i.id === itemId)?.name ?? ''));
        }
        if (newQuantity <= 0) {
            setTransferItems(transferItems.filter(i => i.itemId !== itemId));
        } else {
            setTransferItems(transferItems.map(i => i.itemId === itemId ? { ...i, quantity: newQuantity, price: newPrice } : i));
        }
    };
    
    const generatePDF = (order: FranchiseOrder) => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Transferencia de Inventario", 14, 22);
        doc.setFontSize(12);
        doc.text(`Franquicia: ${franchise.name}`, 14, 32);
        doc.text(`Fecha: ${new Date(order.date).toLocaleDateString()}`, 14, 38);
        doc.text(`Pedido ID: ${order.id}`, 14, 44);
        doc.text(`Tipo: ${TRANSLATIONS[order.type]}`, 14, 50);

        const tableColumn = ["Artículo", "Cantidad", "Precio Unitario", "Total"];
        const tableRows: any[] = [];
        let totalValue = 0;

        order.items.forEach(item => {
            const inventoryItem = data.inventory.find(i => i.id === item.itemId);
            const itemTotal = item.price * item.quantity;
            totalValue += itemTotal;
            const itemData = [
                inventoryItem?.name ?? TRANSLATIONS.unknownItem,
                item.quantity,
                formatCurrency(item.price),
                formatCurrency(itemTotal)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.text(`Total del Pedido: ${formatCurrency(totalValue)}`, 14, finalY + 15);
        
        doc.save(`transferencia_${franchise.name}_${order.id}.pdf`);
    };

    const handleConfirmTransfer = () => {
        if (transferItems.length === 0) return;
        setCreating(true);

        const newOrder: FranchiseOrder = {
            id: `fo${Date.now()}`,
            franchiseId: franchise.id,
            items: transferItems,
            date: new Date().toISOString(),
            type: orderType,
            status: orderType === 'sale' ? 'pending-payment' : 'consignment-active',
        };

        // Update main business inventory
        const updatedMainInventory = data.inventory.map(invItem => {
            const transferItem = transferItems.find(dItem => dItem.itemId === invItem.id);
            if (transferItem) {
                return { ...invItem, stock: invItem.stock - transferItem.quantity };
            }
            return invItem;
        });

        // Update franchise inventory
        const updatedFranchiseInventory = [...franchise.inventory];
        transferItems.forEach(tItem => {
            const franchiseItem = updatedFranchiseInventory.find(i => i.itemId === tItem.itemId);
            if (franchiseItem) {
                franchiseItem.stock += tItem.quantity;
            } else {
                updatedFranchiseInventory.push({ itemId: tItem.itemId, stock: tItem.quantity, customerPrice: 0 });
            }
        });
        
        const updatedFranchises = data.franchises.map(f => f.id === franchise.id ? {...f, inventory: updatedFranchiseInventory} : f);

        setTimeout(() => {
            setData({
                ...data,
                franchiseOrders: [newOrder, ...data.franchiseOrders],
                inventory: updatedMainInventory,
                franchises: updatedFranchises,
            });
            generatePDF(newOrder);
            setCreating(false);
            onClose();
        }, 500);
    };

    const sellableItems = useMemo(() => data.inventory.filter(i => i.isSellable), [data.inventory]);

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.transferTo(franchise.name)}</h3>

                <div className="order-type-toggle">
                    <span>{TRANSLATIONS.orderType}:</span>
                    <button onClick={() => setOrderType('sale')} className={orderType === 'sale' ? 'active' : ''}>{TRANSLATIONS.sale}</button>
                    <button onClick={() => setOrderType('consignment')} className={orderType === 'consignment' ? 'active' : ''}>{TRANSLATIONS.consignment}</button>
                </div>
                
                <AddItemToTransferForm items={sellableItems} inventory={data.inventory} onAddItem={handleAddItem} />

                <h4>{TRANSLATIONS.itemsToTransfer}</h4>
                {transferItems.length === 0 ? (
                     <p className="empty-state">{TRANSLATIONS.noItemsToTransfer}</p>
                ) : (
                    <div className="dispatch-item-editor-list">
                        <div className="dispatch-item-editor-header">
                           <span>{TRANSLATIONS.item}</span>
                           <span>{TRANSLATIONS.quantity}</span>
                           <span>{TRANSLATIONS.price}</span>
                           <span></span>
                        </div>
                        {transferItems.map(item => {
                            const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                            return (
                                <div key={item.itemId} className="dispatch-item-editor-row">
                                    <span className="item-name">{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</span>
                                    <input
                                        type="number"
                                        className="item-input"
                                        value={item.quantity}
                                        onChange={(e) => updateItemInTransfer(item.itemId, parseInt(e.target.value) || 0, item.price)}
                                        max={inventoryItem?.stock}
                                        min="0"
                                    />
                                    <input
                                        type="number"
                                        className="item-input"
                                        value={item.price}
                                        onChange={(e) => updateItemInTransfer(item.itemId, item.quantity, parseFloat(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <button className="delete-item-btn" onClick={() => updateItemInTransfer(item.itemId, 0, 0)}>
                                        <ICONS.Delete />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}


                <button className="submit-btn" onClick={handleConfirmTransfer} disabled={creating || transferItems.length === 0}>
                    {creating ? TRANSLATIONS.transferring : TRANSLATIONS.confirmTransfer}
                </button>
            </div>
        </div>
    );
};

const AddItemToTransferForm = ({ items, inventory, onAddItem }: { items: Item[], inventory: Item[], onAddItem: (item: Item, quantity: number) => void }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('1');
    const selectedItemDetails = useMemo(() => items.find(i => i.id === selectedItem), [items, selectedItem]);
    const stock = useMemo(() => inventory.find(i => i.id === selectedItem)?.stock ?? 0, [inventory, selectedItem]);

    const handleAddClick = () => {
        if (selectedItemDetails && parseInt(quantity) > 0) {
            onAddItem(selectedItemDetails, parseInt(quantity));
            setSelectedItem('');
            setQuantity('1');
        }
    };
    
    return (
        <div className="add-item-to-dispatch-form">
            <div className="form-group">
                <label>{TRANSLATIONS.item}</label>
                <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                    <option value="" disabled>--</option>
                    {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>{TRANSLATIONS.quantity}</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" max={stock} disabled={!selectedItem}/>
                {selectedItem && <p className="form-helper-text">{stock} {TRANSLATIONS.inStock}</p>}
            </div>
            <div className="form-group">
                <button className="submit-btn" onClick={handleAddClick} disabled={!selectedItem || parseInt(quantity) > stock}>{TRANSLATIONS.add}</button>
            </div>
        </div>
    );
};


const FranchiseOrdersCard = ({ data, setData, onDuplicateOrder }: { data: AppData, setData: (d: AppData) => void, onDuplicateOrder: (order: FranchiseOrder) => void }) => {
    const [showPayModal, setShowPayModal] = useState<FranchiseOrder | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState<FranchiseOrder | null>(null);

    const handleReject = (orderId: string) => {
        setData({
            ...data,
            franchiseOrders: data.franchiseOrders.map(o => o.id === orderId ? { ...o, status: 'request-rejected' } : o)
        });
    };

    const handleActionClick = (order: FranchiseOrder) => {
        if (order.status === 'request-pending') {
            setShowApprovalModal(order);
        } else {
            setShowPayModal(order);
        }
    };
    
    const generatePDF = (order: FranchiseOrder) => {
        const doc = new jsPDF();
        const franchise = data.franchises.find(f => f.id === order.franchiseId);
        
        doc.setFontSize(20);
        doc.text("Transferencia de Inventario", 14, 22);
        doc.setFontSize(12);
        doc.text(`Franquicia: ${franchise?.name ?? 'N/A'}`, 14, 32);
        doc.text(`Fecha: ${new Date(order.date).toLocaleDateString()}`, 14, 38);
        doc.text(`Pedido ID: ${order.id}`, 14, 44);
        doc.text(`Tipo: ${TRANSLATIONS[order.type]}`, 14, 50);

        const tableColumn = ["Artículo", "Cantidad", "Precio Unitario", "Total"];
        const tableRows: any[] = [];
        let totalValue = 0;

        order.items.forEach(item => {
            const inventoryItem = data.inventory.find(i => i.id === item.itemId);
            const itemTotal = item.price * item.quantity;
            totalValue += itemTotal;
            const itemData = [
                inventoryItem?.name ?? TRANSLATIONS.unknownItem,
                item.quantity,
                formatCurrency(item.price),
                formatCurrency(itemTotal)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.text(`Total del Pedido: ${formatCurrency(totalValue)}`, 14, finalY + 15);
        
        doc.save(`transferencia_${franchise?.name ?? 'fran'}_${order.id}.pdf`);
    };

    return (
        <div className="card franchise-orders-card">
            <h3 className="card-header">{TRANSLATIONS.franchiseOrders}</h3>
            <div className="table-container">
                <table className="dispatch-table">
                    <thead>
                        <tr>
                            <th>{TRANSLATIONS.order}</th>
                            <th>{TRANSLATIONS.franchise}</th>
                            <th>{TRANSLATIONS.date}</th>
                            <th>{TRANSLATIONS.totalValue}</th>
                            <th>{TRANSLATIONS.status}</th>
                            <th>{TRANSLATIONS.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.franchiseOrders.length === 0 ? (
                            <tr><td colSpan={6} className="empty-state">{TRANSLATIONS.noFranchiseOrders}</td></tr>
                        ) : (
                            data.franchiseOrders.map(order => {
                                const statusInfo = getFranchiseOrderStatusInfo(order.status);
                                const totalValue = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                return (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{data.franchises.find(f => f.id === order.franchiseId)?.name ?? 'N/A'}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>{formatCurrency(totalValue)}</td>
                                    <td><span className={`status-badge ${order.status.replace(/-/g, '')}`}>{statusInfo.text}</span></td>
                                    <td className="table-actions">
                                        {statusInfo.action &&
                                            <button className="table-action-btn reconcile" onClick={() => handleActionClick(order)}>{statusInfo.action}</button>
                                        }
                                        {order.status === 'request-pending' &&
                                            <button className="table-action-btn delete" onClick={() => handleReject(order.id)}>{TRANSLATIONS.reject}</button>
                                        }
                                        <button className="table-action-btn copy" onClick={() => onDuplicateOrder(order)} title={TRANSLATIONS.duplicateOrder}><ICONS.Copy/></button>
                                        <button className="table-action-btn download" onClick={() => generatePDF(order)} title={TRANSLATIONS.downloadPDF}><ICONS.Download/></button>
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </div>
            {showPayModal && <FranchiseOrderModal order={showPayModal} data={data} setData={setData} onClose={() => setShowPayModal(null)} />}
            {showApprovalModal && <ApprovalModal order={showApprovalModal} data={data} setData={setData} onClose={() => setShowApprovalModal(null)} />}
        </div>
    );
};

const FranchiseOrderModal = ({ order, data, setData, onClose }: { order: FranchiseOrder, data: AppData, setData: (d: AppData) => void, onClose: () => void }) => {
    const isSale = order.type === 'sale';
    const isReadOnly = order.status === 'paid' || order.status === 'consignment-reconciled';
    const title = isSale ? TRANSLATIONS.payFranchiseOrder : TRANSLATIONS.reconcileFranchiseOrder;

    // State for sale payment
    const [payments, setPayments] = useState(order.paymentDetails ?? { cash: 0, sinpe: { total: 0, transactions: [] }, other: 0, history: [] });
    
    // State for consignment reconciliation
    const initialReturns = useMemo(() => 
        order.items?.map(item => ({ itemId: item.itemId, returned: order.reconciliation?.items?.find(r => r.itemId === item.itemId)?.returned ?? 0 })) ?? [],
        [order]
    );
    const [returnedItems, setReturnedItems] = useState(initialReturns);
    const [consignmentPayments, setConsignmentPayments] = useState(order.reconciliation?.payments ?? { cash: 0, sinpe: { total: 0, transactions: [] }, other: 0 });

    const orderTotal = useMemo(() => order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0), [order.items]);

    // Sale logic
    const amountPaid = useMemo(() => payments.history.reduce((sum, p) => sum + p.amount, 0), [payments.history]);
    const balance = orderTotal - amountPaid;

    const handleSavePayment = () => {
        const newCash = payments.cash;
        const newSinpe = payments.sinpe;
        const newOther = payments.other;
        const newPaymentAmount = newCash + newSinpe.total + newOther;
        
        if (newPaymentAmount <= 0) return;

        const newHistory = [...payments.history];
        if (newCash > 0) newHistory.push({ date: new Date().toISOString(), amount: newCash, type: 'cash' });
        if (newSinpe.total > 0) newHistory.push({ date: new Date().toISOString(), amount: newSinpe.total, type: 'sinpe' });
        if (newOther > 0) newHistory.push({ date: new Date().toISOString(), amount: newOther, type: 'other' });

        const totalPaid = amountPaid + newPaymentAmount;
        
        const newStatus: FranchiseOrder['status'] = totalPaid >= orderTotal ? 'paid' : 'partial-payment';

        const updatedOrder: FranchiseOrder = {
            ...order,
            status: newStatus,
            paymentDetails: {
                ...payments,
                cash: 0,
                sinpe: { total: 0, transactions: [] },
                other: 0,
                history: newHistory,
            }
        };

        setData({ ...data, franchiseOrders: data.franchiseOrders.map(o => o.id === order.id ? updatedOrder : o) });
        onClose();
    };

    // Consignment logic
    const handleReturnChange = (itemId: string, value: number) => {
        const orderItem = order.items.find(i => i.itemId === itemId);
        const maxReturns = orderItem?.quantity ?? 0;
        const newReturned = Math.max(0, Math.min(maxReturns, value));
        setReturnedItems(returnedItems.map(item => item.itemId === itemId ? { ...item, returned: newReturned } : item));
    };

    const consignmentFinancials = useMemo(() => {
        const expectedRevenue = order.items?.reduce((total, item) => {
            const returnedQty = returnedItems?.find(r => r.itemId === item.itemId)?.returned ?? 0;
            const soldQty = item.quantity - returnedQty;
            return total + (soldQty * item.price);
        }, 0) ?? 0;
        
        const totalPaid = consignmentPayments.cash + consignmentPayments.sinpe.total + consignmentPayments.other;
        const discrepancy = totalPaid - expectedRevenue;

        return { expectedRevenue, totalPaid, discrepancy };
    }, [order.items, returnedItems, consignmentPayments]);

    const handleSaveConsignmentReconciliation = () => {
         const newReconciliation: NonNullable<FranchiseOrder['reconciliation']> = {
            date: new Date().toISOString(),
            items: returnedItems,
            payments: consignmentPayments,
        };

        const expectedRevenue = consignmentFinancials.expectedRevenue;
        const totalPaid = consignmentFinancials.totalPaid;
        const newStatus: FranchiseOrder['status'] = totalPaid >= expectedRevenue ? 'consignment-reconciled' : 'consignment-partial';

        const updatedOrder: FranchiseOrder = { ...order, status: newStatus, reconciliation: newReconciliation };

        // Add returned items back to franchise stock
        const franchise = data.franchises.find(f => f.id === order.franchiseId);
        if (franchise) {
            const updatedFranchiseInventory = franchise.inventory.map(invItem => {
                const returned = returnedItems.find(r => r.itemId === invItem.itemId);
                if (returned) {
                    return { ...invItem, stock: invItem.stock + returned.returned };
                }
                return invItem;
            });
            const updatedFranchises = data.franchises.map(f => f.id === franchise.id ? {...f, inventory: updatedFranchiseInventory} : f);
            setData({ ...data, franchises: updatedFranchises, franchiseOrders: data.franchiseOrders.map(o => o.id === order.id ? updatedOrder : o) });
        } else {
             setData({ ...data, franchiseOrders: data.franchiseOrders.map(o => o.id === order.id ? updatedOrder : o) });
        }
        
        onClose();
    };
    
    const handleSinpeChange = (transactions: number[]) => {
        const total = transactions.reduce((sum, tx) => sum + tx, 0);
        if(isSale) {
            setPayments(p => ({ ...p, sinpe: { total, transactions } }));
        } else {
            setConsignmentPayments(p => ({ ...p, sinpe: { total, transactions } }));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{isReadOnly ? TRANSLATIONS.viewOrder : title}</h3>
                <p className="modal-subtitle">{TRANSLATIONS.order}: {order.id}</p>

                {isSale ? (
                    <div className="reconciliation-financials">
                        <div className="payment-inputs">
                            <h4>{TRANSLATIONS.newPayment}</h4>
                            <div className="form-group">
                                <label>{TRANSLATIONS.cashPayment}</label>
                                <input type="number" value={payments.cash} onChange={e => setPayments({...payments, cash: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                             <div className="form-group">
                                <label>{TRANSLATIONS.otherPayment}</label>
                                <input type="number" value={payments.other} onChange={e => setPayments({...payments, other: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                            <SinpeCalculator transactions={payments.sinpe.transactions} onTransactionsChange={handleSinpeChange} />
                        </div>
                        <div className="financial-summary-section">
                             <h4>{TRANSLATIONS.financialSummary}</h4>
                             <div className="order-summary-in-modal">
                                 <div className="summary-item total">
                                    <span>{TRANSLATIONS.orderTotal}</span>
                                    <strong>{formatCurrency(orderTotal)}</strong>
                                 </div>
                                 <div className="summary-item">
                                    <span>{TRANSLATIONS.amountPaid}</span>
                                    <strong>{formatCurrency(amountPaid)}</strong>
                                 </div>
                                 <div className="summary-item balance">
                                    <span>{TRANSLATIONS.remainingBalance}</span>
                                    <strong>{formatCurrency(balance)}</strong>
                                 </div>
                             </div>
                        </div>
                    </div>
                ) : ( // Consignment
                    <div className="reconciliation-body">
                        <div>
                        <h4>{TRANSLATIONS.itemsSummary}</h4>
                        <table className="reconciliation-table">
                            <thead>
                                <tr>
                                    <th>{TRANSLATIONS.item}</th>
                                    <th>{TRANSLATIONS.dispatchedQty}</th>
                                    <th>{TRANSLATIONS.returned}</th>
                                    <th>{TRANSLATIONS.sold}</th>
                                    <th>{TRANSLATIONS.revenue}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.items ?? []).map(item => {
                                    const returnedQty = returnedItems?.find(r => r.itemId === item.itemId)?.returned ?? 0;
                                    const soldQty = item.quantity - returnedQty;
                                    const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                                    return (
                                        <tr key={item.itemId}>
                                            <td>{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={returnedQty} 
                                                    onChange={e => handleReturnChange(item.itemId, parseInt(e.target.value) || 0)} 
                                                    disabled={isReadOnly}
                                                    max={item.quantity}
                                                    min={0}
                                                />
                                            </td>
                                            <td>{soldQty}</td>
                                            <td>{formatCurrency(soldQty * item.price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="reconciliation-financials">
                        <div className="payment-inputs">
                            <h4>{TRANSLATIONS.paymentsReceived}</h4>
                            <div className="form-group">
                                <label>{TRANSLATIONS.cashPayment}</label>
                                <input type="number" value={consignmentPayments.cash} onChange={e => setConsignmentPayments({...consignmentPayments, cash: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                             <div className="form-group">
                                <label>{TRANSLATIONS.otherPayment}</label>
                                <input type="number" value={consignmentPayments.other} onChange={e => setConsignmentPayments({...consignmentPayments, other: parseFloat(e.target.value) || 0})} disabled={isReadOnly} />
                            </div>
                            <SinpeCalculator transactions={consignmentPayments.sinpe.transactions} onTransactionsChange={handleSinpeChange} />
                        </div>
                        <div className="financial-summary-section">
                             <h4>{TRANSLATIONS.financialSummary}</h4>
                             <div className="financial-summary">
                                 <div className="summary-item">
                                    <span>{TRANSLATIONS.expectedRevenue}</span>
                                    <strong>{formatCurrency(consignmentFinancials.expectedRevenue)}</strong>
                                 </div>
                                 <div className="summary-item">
                                    <span>{TRANSLATIONS.totalPaid}</span>
                                    <strong>{formatCurrency(consignmentFinancials.totalPaid)}</strong>
                                 </div>
                                 <div className={`summary-item discrepancy ${consignmentFinancials.discrepancy < 0 ? 'short' : 'over'}`}>
                                    <span>{TRANSLATIONS.discrepancy}</span>
                                    <strong>{formatCurrency(consignmentFinancials.discrepancy)}</strong>
                                 </div>
                             </div>
                        </div>
                    </div>
                    </div>
                )}
                
                {!isReadOnly && <button className="submit-btn" style={{marginTop: '2rem'}} onClick={isSale ? handleSavePayment : handleSaveConsignmentReconciliation}>{TRANSLATIONS.savePayment}</button>}
            </div>
        </div>
    );
};

const ApprovalModal = ({ order, data, setData, onClose }: { order: FranchiseOrder, data: AppData, setData: (d: AppData) => void, onClose: () => void }) => {
    const [orderType, setOrderType] = useState<FranchiseOrderType>('sale');

    const stockCheck = useMemo(() => {
        return order.items.map(reqItem => {
            const mainItem = data.inventory.find(i => i.id === reqItem.itemId);
            return {
                ...reqItem,
                name: mainItem?.name ?? TRANSLATIONS.unknownItem,
                available: mainItem?.stock ?? 0,
                sufficient: mainItem ? mainItem.stock >= reqItem.quantity : false
            };
        });
    }, [order, data.inventory]);

    const orderTotal = useMemo(() => stockCheck.reduce((sum, item) => sum + (item.price * item.quantity), 0), [stockCheck]);

    const canApprove = useMemo(() => stockCheck.every(item => item.sufficient), [stockCheck]);

    const handleConfirm = () => {
        if (!canApprove) {
            alert("No se puede aprobar, no hay stock suficiente.");
            return;
        }

        // Update main business inventory
        const updatedMainInventory = data.inventory.map(invItem => {
            const transferItem = order.items.find(dItem => dItem.itemId === invItem.id);
            return transferItem ? { ...invItem, stock: invItem.stock - transferItem.quantity } : invItem;
        });

        // Update franchise inventory
        const franchise = data.franchises.find(f => f.id === order.franchiseId);
        if (!franchise) return; // Should not happen

        const updatedFranchiseInventory = [...franchise.inventory];
        order.items.forEach(tItem => {
            const franchiseItem = updatedFranchiseInventory.find(i => i.itemId === tItem.itemId);
            if (franchiseItem) {
                franchiseItem.stock += tItem.quantity;
            } else {
                const mainItemDetails = data.inventory.find(i => i.id === tItem.itemId);
                updatedFranchiseInventory.push({ itemId: tItem.itemId, stock: tItem.quantity, customerPrice: mainItemDetails?.isSellable ? 0 : undefined });
            }
        });
        
        const updatedFranchises = data.franchises.map(f => f.id === franchise.id ? {...f, inventory: updatedFranchiseInventory} : f);

        // Update the order itself
        const updatedOrder = { 
            ...order, 
            type: orderType, 
            status: orderType === 'sale' ? 'pending-payment' : 'consignment-active' as FranchiseOrderStatus
        };
        
        const updatedFranchiseOrders = data.franchiseOrders.map(o => o.id === order.id ? updatedOrder : o);

        setData({
            ...data,
            franchiseOrders: updatedFranchiseOrders,
            inventory: updatedMainInventory,
            franchises: updatedFranchises,
        });

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.approveRequest}</h3>
                <p className="modal-subtitle">{TRANSLATIONS.order}: {order.id}</p>

                <div className="reconciliation-body">
                    <div>
                        <h4>{TRANSLATIONS.stockCheck}</h4>
                        <table className="reconciliation-table">
                            <thead>
                                <tr>
                                    <th>{TRANSLATIONS.item}</th>
                                    <th>{TRANSLATIONS.requested}</th>
                                    <th>{TRANSLATIONS.price}</th>
                                    <th>{TRANSLATIONS.subtotal}</th>
                                    <th>{TRANSLATIONS.stockAvailable}</th>
                                    <th>{TRANSLATIONS.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockCheck.map(item => (
                                    <tr key={item.itemId} className={!item.sufficient ? 'insufficient-stock-row' : ''}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{formatCurrency(item.price * item.quantity)}</td>
                                        <td>{item.available}</td>
                                        <td>
                                            {item.sufficient ? 
                                                <span className="status-badge reconciled">{TRANSLATIONS.yes}</span> : 
                                                <span className="status-badge cancelled">{TRANSLATIONS.no}</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot>
                                <tr>
                                    <td colSpan={3}><strong>{TRANSLATIONS.orderTotal}</strong></td>
                                    <td><strong>{formatCurrency(orderTotal)}</strong></td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                        {!canApprove && <p className="login-error" style={{marginTop: '1rem'}}>{TRANSLATIONS.insufficientStock}</p>}
                    </div>
                     <div>
                        <h4>{TRANSLATIONS.orderType}</h4>
                        <div className="order-type-toggle" style={{justifyContent: 'center'}}>
                            <button onClick={() => setOrderType('sale')} className={orderType === 'sale' ? 'active' : ''}>{TRANSLATIONS.sale}</button>
                            <button onClick={() => setOrderType('consignment')} className={orderType === 'consignment' ? 'active' : ''}>{TRANSLATIONS.consignment}</button>
                        </div>
                    </div>
                </div>

                <button className="submit-btn" style={{marginTop: '2rem'}} onClick={handleConfirm} disabled={!canApprove}>
                    {TRANSLATIONS.confirmApproval}
                </button>
            </div>
        </div>
    );
};

const FranchiseRequestDetailsModal = ({ order, data, onClose }: { order: FranchiseOrder, data: AppData, onClose: () => void }) => {
    const totalValue = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const statusInfo = getFranchiseOrderStatusInfo(order.status);
    
    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.requestDetails}</h3>
                <p className="modal-subtitle">{TRANSLATIONS.order} #{order.id} - <span className={`status-badge ${order.status.replace(/-/g, '')}`}>{statusInfo.text}</span></p>

                <div className="reconciliation-body" style={{gridTemplateColumns: '1fr'}}>
                    <div>
                        <h4>{TRANSLATIONS.itemsSummary}</h4>
                        <table className="reconciliation-table">
                            <thead>
                                <tr>
                                    <th>{TRANSLATIONS.item}</th>
                                    <th>{TRANSLATIONS.quantity}</th>
                                    <th>{TRANSLATIONS.price}</th>
                                    <th>{TRANSLATIONS.subtotal}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => {
                                    const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                                    return (
                                        <tr key={item.itemId}>
                                            <td>{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}><strong>{TRANSLATIONS.total}</strong></td>
                                    <td><strong>{formatCurrency(totalValue)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <button className="submit-btn" style={{marginTop: '2rem', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto'}} onClick={onClose}>{TRANSLATIONS.close}</button>
            </div>
        </div>
    );
};


const StoreManagementView = ({ data, setData, onPreviewStore, currentUser }: { data: AppData, setData: (d: AppData) => void, onPreviewStore: (franchiseId: string) => void, currentUser: User }) => {
    type StoreTab = 'franchiseStores' | 'discountCodes' | 'onlineOrders' | 'customers' | 'referrals';
    
    const isFranchiseManager = currentUser.role === 'franchise-manager';

    const availableTabs = useMemo(() => {
        const allTabs: { id: StoreTab, label: string }[] = [
            { id: 'franchiseStores', label: TRANSLATIONS.franchiseStores },
            { id: 'discountCodes', label: TRANSLATIONS.discountCodes },
            { id: 'onlineOrders', label: TRANSLATIONS.onlineOrders },
            { id: 'customers', label: TRANSLATIONS.customers },
            { id: 'referrals', label: TRANSLATIONS.Referrals },
        ];
        if (isFranchiseManager) {
            return allTabs.filter(tab => ['onlineOrders', 'customers', 'referrals'].includes(tab.id));
        }
        return allTabs;
    }, [isFranchiseManager]);

    const [activeTab, setActiveTab] = useState<StoreTab>(availableTabs[0].id);

    useEffect(() => {
        // Reset to a valid tab if the current one is no longer available (e.g., context change)
        if (!availableTabs.some(t => t.id === activeTab)) {
            setActiveTab(availableTabs[0].id);
        }
    }, [availableTabs, activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'franchiseStores':
                return <FranchiseStoreSettings data={data} setData={setData} onPreviewStore={onPreviewStore} />;
            case 'discountCodes':
                return <DiscountCodeSettings data={data} setData={setData} />;
            case 'onlineOrders':
                return <OnlineOrdersView data={data} setData={setData} currentUser={currentUser} />;
            case 'customers':
                return <CustomersView data={data} currentUser={currentUser} />;
            case 'referrals':
                return <ReferralManagementView data={data} setData={setData} currentUser={currentUser} />;
            default:
                return null;
        }
    };

    return (
        <div className="store-management-view">
            <div className="card">
                <nav className="tabs-nav">
                    {availableTabs.map(tab => (
                         <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}>{tab.label}</button>
                    ))}
                </nav>
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

const FranchiseStoreSettings = ({ data, setData, onPreviewStore }: { data: AppData, setData: (d: AppData) => void, onPreviewStore: (franchiseId: string) => void }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const handleToggleAccordion = (franchiseId: string) => {
        setOpenAccordion(openAccordion === franchiseId ? null : franchiseId);
    };

    const handleSettingsChange = (franchiseId: string, field: keyof FranchiseStoreSettings, value: string | boolean) => {
        const updatedFranchises = data.franchises.map(f => {
            if (f.id === franchiseId) {
                return { ...f, storeSettings: { ...f.storeSettings, [field]: value } };
            }
            return f;
        });
        setData({ ...data, franchises: updatedFranchises });
    };
    
    const handlePriceChange = (franchiseId: string, itemId: string, newPrice: number) => {
         const updatedFranchises = data.franchises.map(f => {
            if (f.id === franchiseId) {
                const updatedInventory = f.inventory.map(inv => {
                    if (inv.itemId === itemId) {
                        return { ...inv, customerPrice: newPrice };
                    }
                    return inv;
                });
                return { ...f, inventory: updatedInventory };
            }
            return f;
        });
        setData({ ...data, franchises: updatedFranchises });
    };

    return (
        <div className="accordion">
            {data.franchises.map(franchise => (
                <div key={franchise.id} className="accordion-item">
                    <button className="accordion-header" onClick={() => handleToggleAccordion(franchise.id)}>
                        {franchise.name}
                        <ICONS.ChevronDown style={{ transform: openAccordion === franchise.id ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                    </button>
                    {openAccordion === franchise.id && (
                        <div className="accordion-content">
                            <div className="store-settings-form">
                                <h4>{TRANSLATIONS.storeSettings}</h4>
                                <div className="form-group-toggle">
                                    <label htmlFor={`store-enabled-${franchise.id}`}>{TRANSLATIONS.storeIsEnabled}</label>
                                    <label className="switch">
                                        <input
                                            id={`store-enabled-${franchise.id}`}
                                            type="checkbox"
                                            checked={franchise.storeSettings.isEnabled}
                                            onChange={e => handleSettingsChange(franchise.id, 'isEnabled', e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{TRANSLATIONS.storeName}</label>
                                        <input type="text" value={franchise.storeSettings.storeName} onChange={e => handleSettingsChange(franchise.id, 'storeName', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{TRANSLATIONS.whatsappNumber}</label>
                                        <input type="tel" value={franchise.storeSettings.whatsappNumber} onChange={e => handleSettingsChange(franchise.id, 'whatsappNumber', e.target.value)} />
                                    </div>
                                     <div className="form-group">
                                        <label>{TRANSLATIONS.storeUrlSlug}</label>
                                        <input type="text" value={franchise.storeSettings.urlSlug} onChange={e => handleSettingsChange(franchise.id, 'urlSlug', e.target.value)} />
                                    </div>
                                </div>
                                <button className="store-link" onClick={() => onPreviewStore(franchise.id)}>
                                    {TRANSLATIONS.viewStore}
                                </button>
                            </div>

                            <div className="price-settings-table">
                                <h4>{TRANSLATIONS.pricesAndImages}</h4>
                                <table className="inventory-table">
                                     <thead>
                                        <tr>
                                            <th>{TRANSLATIONS.image}</th>
                                            <th>{TRANSLATIONS.item}</th>
                                            <th>{TRANSLATIONS.customerPrice}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.inventory.filter(i => i.isSellable).map(item => {
                                            const franchiseInv = franchise.inventory.find(i => i.itemId === item.id);
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="item-image-thumbnail" /> : <div className="item-image-thumbnail">{TRANSLATIONS.noImage}</div>}
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <input 
                                                            type="number" 
                                                            className="item-input"
                                                            value={franchiseInv?.customerPrice ?? ''}
                                                            onChange={e => handlePriceChange(franchise.id, item.id, parseFloat(e.target.value) || 0)}
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const DiscountCodeSettings = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
    const [code, setCode] = useState('');
    const [type, setType] = useState<'fixed' | 'percentage'>('fixed');
    const [value, setValue] = useState('');
    
    const handleAddCode = () => {
        if (!code.trim() || !value) return;
        const newDiscount: DiscountCode = {
            id: `d${Date.now()}`,
            code: code.trim().toUpperCase(),
            type,
            value: parseFloat(value),
            isActive: true,
        };
        setData({ ...data, discountCodes: [...data.discountCodes, newDiscount] });
        setCode('');
        setValue('');
    };

    const toggleActive = (id: string) => {
        setData({
            ...data,
            discountCodes: data.discountCodes.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d)
        });
    };
    
    const handleDeleteCode = (id: string) => {
        setData({
            ...data,
            discountCodes: data.discountCodes.filter(d => d.id !== id)
        });
    };

    return (
        <div>
            <h4>{TRANSLATIONS.manageDiscounts}</h4>
            <div className="form-grid" style={{alignItems: 'flex-end', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1.5rem'}}>
                 <div className="form-group">
                    <label>{TRANSLATIONS.code}</label>
                    <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>{TRANSLATIONS.type}</label>
                    <select value={type} onChange={e => setType(e.target.value as any)}>
                        <option value="fixed">{TRANSLATIONS.fixed}</option>
                        <option value="percentage">{TRANSLATIONS.percentage}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>{TRANSLATIONS.value}</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)} />
                </div>
                <div className="form-group">
                    <button className="submit-btn" onClick={handleAddCode}>{TRANSLATIONS.addDiscountCode}</button>
                </div>
            </div>
            
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>{TRANSLATIONS.code}</th>
                        <th>{TRANSLATIONS.type}</th>
                        <th>{TRANSLATIONS.value}</th>
                        <th>{TRANSLATIONS.active}</th>
                        <th>{TRANSLATIONS.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.discountCodes.length === 0 ? 
                        <tr><td colSpan={5} className="empty-state">{TRANSLATIONS.noDiscountCodes}</td></tr> : 
                        data.discountCodes.map(d => (
                        <tr key={d.id}>
                            <td>{d.code}</td>
                            <td>{TRANSLATIONS[d.type]}</td>
                            <td>{d.type === 'fixed' ? formatCurrency(d.value) : `${d.value}%`}</td>
                            <td>
                                <label className="switch">
                                    <input type="checkbox" checked={d.isActive} onChange={() => toggleActive(d.id)} />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td><button className="delete-item-btn" onClick={() => handleDeleteCode(d.id)}><ICONS.Delete /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const OnlineOrdersView = ({ data, setData, currentUser }: { data: AppData, setData: (d: AppData) => void, currentUser: User }) => {
    const [showDetailsModal, setShowDetailsModal] = useState<StoreOrder | null>(null);
    const isFranchiseManager = currentUser.role === 'franchise-manager';

    const ordersToShow = useMemo(() => {
        let orders = [...data.storeOrders].reverse();
        if (isFranchiseManager) {
            return orders.filter(o => o.franchiseId === currentUser.franchiseId);
        }
        return orders;
    }, [data.storeOrders, isFranchiseManager, currentUser.franchiseId]);

    const handleStatusChange = (orderId: string, newStatus: StoreOrder['status']) => {
        setData({
            ...data,
            storeOrders: data.storeOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        });
    };

    return (
        <div>
             <table className="inventory-table">
                <thead>
                    <tr>
                        <th>{TRANSLATIONS.date}</th>
                        <th>{TRANSLATIONS.franchise}</th>
                        <th>{TRANSLATIONS.customerName}</th>
                        <th>{TRANSLATIONS.total}</th>
                        <th>{TRANSLATIONS.status}</th>
                        <th>{TRANSLATIONS.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersToShow.length === 0 ? 
                        <tr><td colSpan={6} className="empty-state">{TRANSLATIONS.noOnlineOrders}</td></tr> : 
                        ordersToShow.map(order => {
                            const customer = data.customers.find(c => c.id === order.customerId);
                            const franchise = data.franchises.find(f => f.id === order.franchiseId);
                            return (
                                <tr key={order.id}>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>{franchise?.name ?? 'N/A'}</td>
                                    <td>{customer?.name ?? 'N/A'}</td>
                                    <td>{formatCurrency(order.total)}</td>
                                    <td>
                                        <select 
                                            value={order.status} 
                                            onChange={e => handleStatusChange(order.id, e.target.value as StoreOrder['status'])}
                                            className={`status-select ${order.status}`}
                                        >
                                            <option value="pending">{TRANSLATIONS.pending}</option>
                                            <option value="confirmed">{TRANSLATIONS.confirmed}</option>
                                            <option value="delivered">{TRANSLATIONS.delivered}</option>
                                            <option value="cancelled">{TRANSLATIONS.cancelled}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="table-action-btn view" onClick={() => setShowDetailsModal(order)}>
                                            {TRANSLATIONS.viewDetails}
                                        </button>
                                    </td>
                                </tr>
                            );
                    })}
                </tbody>
            </table>
            {showDetailsModal && 
                <OrderDetailsModal 
                    order={showDetailsModal} 
                    customer={data.customers.find(c => c.id === showDetailsModal.customerId)}
                    onClose={() => setShowDetailsModal(null)}
                />
            }
        </div>
    );
};

const OrderDetailsModal = ({ order, customer, onClose }: { order: StoreOrder, customer?: Customer, onClose: () => void }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.orderInfo}</h3>
                <p className="modal-subtitle">{TRANSLATIONS.order} #{order.id}</p>
                <div className="reconciliation-financials">
                    <div>
                        <h4>{TRANSLATIONS.items}</h4>
                         <ul className="managed-list">
                            {order.items.map(item => (
                                <li key={item.id}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="financial-summary" style={{marginTop: '1rem'}}>
                             <div className="summary-item">
                                <span>{TRANSLATIONS.subtotal}</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            {order.discount.amount > 0 && 
                                <div className="summary-item">
                                    <span>{TRANSLATIONS.discountApplied} ({order.discount.code})</span>
                                    <span>-{formatCurrency(order.discount.amount)}</span>
                                </div>
                            }
                            <div className="summary-item total">
                                <span>{TRANSLATIONS.total}</span>
                                <strong>{formatCurrency(order.total)}</strong>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h4>{TRANSLATIONS.customerInfo}</h4>
                        <div className="customer-details-modal-info">
                            <p><strong>{TRANSLATIONS.name}:</strong> {customer?.name ?? 'N/A'}</p>
                            <p><strong>{TRANSLATIONS.phone}:</strong> {customer?.id ?? 'N/A'}</p>
                            <p style={{gridColumn: '1 / -1'}}><strong>{TRANSLATIONS.address}:</strong> {customer?.address ?? 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomersView = ({ data, currentUser }: { data: AppData, currentUser: User }) => {
    const [showDetailsModal, setShowDetailsModal] = useState<Customer | null>(null);
    const isFranchiseManager = currentUser.role === 'franchise-manager';

    const customersToShow = useMemo(() => {
        if (isFranchiseManager) {
            const franchiseCustomerIds = new Set(
                data.storeOrders
                    .filter(o => o.franchiseId === currentUser.franchiseId)
                    .map(o => o.customerId)
            );
            return data.customers.filter(c => franchiseCustomerIds.has(c.id));
        }
        return data.customers;
    }, [data.customers, data.storeOrders, isFranchiseManager, currentUser.franchiseId]);

    return (
        <div>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>{TRANSLATIONS.name}</th>
                        <th>{TRANSLATIONS.phone}</th>
                        <th>{TRANSLATIONS.address}</th>
                        <th>{TRANSLATIONS.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {customersToShow.length === 0 ? 
                        <tr><td colSpan={4} className="empty-state">{TRANSLATIONS.noCustomers}</td></tr> : 
                        customersToShow.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.id}</td>
                            <td>{c.address}</td>
                            <td>
                                <button className="table-action-btn view" onClick={() => setShowDetailsModal(c)}>
                                    {TRANSLATIONS.viewDetails}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDetailsModal && 
                <CustomerDetailsModal 
                    customer={showDetailsModal}
                    orders={data.storeOrders.filter(o => 
                        o.customerId === showDetailsModal.id && 
                        (!isFranchiseManager || o.franchiseId === currentUser.franchiseId)
                    )}
                    onClose={() => setShowDetailsModal(null)} 
                />
            }
        </div>
    );
};

const CustomerDetailsModal = ({ customer, orders, onClose }: { customer: Customer, orders: StoreOrder[], onClose: () => void }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close /></button>
                <h3>{TRANSLATIONS.customerDetails}</h3>
                <div className="customer-details-modal-info">
                    <p><strong>{TRANSLATIONS.name}:</strong> {customer.name}</p>
                    <p><strong>{TRANSLATIONS.phone}:</strong> {customer.id}</p>
                    <p style={{gridColumn: '1 / -1'}}><strong>{TRANSLATIONS.address}:</strong> {customer.address}</p>
                </div>

                {customer.pendingRewards.length > 0 &&
                    <div className="pending-rewards-section">
                        <h4>{TRANSLATIONS.pendingRewards}</h4>
                        <ul>
                            {customer.pendingRewards.map(reward => <li key={reward.id}>- {reward.description}</li>)}
                        </ul>
                    </div>
                }

                <div className="customer-order-history">
                    <h4>{TRANSLATIONS.orderHistory}</h4>
                     <div className="table-container">
                        <table className="inventory-table">
                             <thead>
                                <tr>
                                    <th>{TRANSLATIONS.date}</th>
                                    <th>{TRANSLATIONS.total}</th>
                                    <th>{TRANSLATIONS.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? 
                                    <tr><td colSpan={3} className="empty-state">{TRANSLATIONS.noOnlineOrders}</td></tr> :
                                    [...orders].reverse().map(order => (
                                        <React.Fragment key={order.id}>
                                            <tr>
                                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                                <td>{formatCurrency(order.total)}</td>
                                                <td>
                                                   <span className={`status-badge ${order.status}`}>{TRANSLATIONS[order.status as keyof typeof TRANSLATIONS] as string}</span>
                                                </td>
                                            </tr>
                                            {order.redeemedRewards && order.redeemedRewards.length > 0 && (
                                                <tr className="reward-redemption-row">
                                                    <td colSpan={3}>
                                                        <div className="reward-redemption-details">
                                                            <p><strong>{TRANSLATIONS.redeemedRewardLabel}:</strong> {order.redeemedRewards.map(r => r.description).join(', ')}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ReferralManagementView = ({ data, setData, currentUser }: { data: AppData, setData: (d: AppData) => void, currentUser: User }) => {
    const [settings, setSettings] = useState(data.referralSettings);
    const isFranchiseManager = currentUser.role === 'franchise-manager';

    const sellableItems = useMemo(() => data.inventory.filter(i => i.isSellable), [data.inventory]);

    const referralsToShow = useMemo(() => {
        const referrals = [...data.referrals].reverse();
        if (isFranchiseManager) {
            const franchiseCustomerIds = new Set(
                data.storeOrders
                    .filter(o => o.franchiseId === currentUser.franchiseId)
                    .map(o => o.customerId)
            );
            return referrals.filter(r => 
                franchiseCustomerIds.has(r.referrerId) || 
                (r.refereeId && franchiseCustomerIds.has(r.refereeId))
            );
        }
        return referrals;
    }, [data.referrals, data.storeOrders, isFranchiseManager, currentUser.franchiseId]);

    const handleSettingChange = (field: keyof ReferralSettings, value: string | number | boolean) => {
        setSettings(s => ({ ...s, [field]: value }));
    };

    const handleSave = () => {
        setData({ ...data, referralSettings: settings });
        alert('Cambios guardados');
    };

    return (
        <div>
            {!isFranchiseManager &&
                <>
                    <div className="form-group-toggle" style={{marginBottom: '1.5rem'}}>
                        <label>{TRANSLATIONS.enableReferralSystem}</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.enabled}
                                onChange={e => handleSettingChange('enabled', e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="form-grid">
                        <div className="form-group" style={{gridColumn: '1 / -1'}}>
                            <label>{TRANSLATIONS.rewardItem}</label>
                            <select value={settings.referrerRewardItemId} onChange={e => handleSettingChange('referrerRewardItemId', e.target.value)}>
                                {sellableItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{TRANSLATIONS.refereeDiscount}</label>
                            <input type="number" value={settings.refereeDiscount} onChange={e => handleSettingChange('refereeDiscount', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label>{TRANSLATIONS.refereeMinPurchase}</label>
                            <input type="number" value={settings.refereeMinPurchase} onChange={e => handleSettingChange('refereeMinPurchase', parseFloat(e.target.value) || 0)} />
                        </div>
                    </div>
                    <button className="submit-btn" style={{marginTop: '1.5rem'}} onClick={handleSave}>{TRANSLATIONS.saveChanges}</button>
                </>
            }

            <h4 style={{marginTop: '2rem', marginBottom: '1rem'}}>{TRANSLATIONS.referralTracking}</h4>
             <table className="inventory-table">
                <thead>
                    <tr>
                        <th>{TRANSLATIONS.date}</th>
                        <th>{TRANSLATIONS.referrer}</th>
                        <th>{TRANSLATIONS.referee}</th>
                        <th>{TRANSLATIONS.status}</th>
                    </tr>
                </thead>
                <tbody>
                    {referralsToShow.length === 0 ? 
                        <tr><td colSpan={4} className="empty-state">{TRANSLATIONS.noReferrals}</td></tr> : 
                        referralsToShow.map(r => {
                            const referrer = data.customers.find(c => c.id === r.referrerId);
                            const referee = data.customers.find(c => c.id === r.refereeId);
                            return (
                                <tr key={r.id}>
                                    <td>{new Date(r.date).toLocaleDateString()}</td>
                                    <td>{referrer?.name ?? r.referrerId}</td>
                                    <td>{referee?.name ?? r.refereeId}</td>
                                    <td><span className={`status-badge ${r.status}`}>{TRANSLATIONS[r.status]}</span></td>
                                </tr>
                            );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// --- Public Store Component ---
const PublicStorePage = ({ franchiseId, allData, setAllData, onClose }: { franchiseId: string, allData: AppData, setAllData: (d: AppData) => void, onClose: () => void }) => {
    const franchise = allData.franchises.find(f => f.id === franchiseId);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountInfo, setDiscountInfo] = useState({ applied: false, message: '', amount: 0, code: '' });
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [lastOrder, setLastOrder] = useState<StoreOrder | null>(null);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [appliedRewardIds, setAppliedRewardIds] = useState<string[]>([]);

    const products = useMemo(() => {
        if (!franchise) return [];
        return allData.inventory
            .filter(item => {
                const franchiseItem = franchise.inventory.find(fi => fi.itemId === item.id);
                return item.isSellable && franchiseItem && franchiseItem.customerPrice != null && franchiseItem.customerPrice > 0;
            })
            .map(item => {
                const franchiseItem = franchise.inventory.find(fi => fi.itemId === item.id)!;
                return {
                    ...item,
                    stock: franchiseItem.stock,
                    price: franchiseItem.customerPrice!
                };
            });
    }, [franchise, allData.inventory]);

    const handleAddToCart = (product: typeof products[0]) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id && !item.isReward);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id && !item.isReward ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateCartQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        } else {
            setCart(prevCart => prevCart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        }
    };
    
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.isReward ? 0 : (item.price ?? 0) * item.quantity), 0), [cart]);

    const handleApplyDiscount = () => {
        setDiscountInfo({ applied: false, message: '', amount: 0, code: ''}); // Reset previous messages

        // Referral code check first
        const referral = allData.referrals.find(r => r.id === discountCode.toUpperCase() && r.status === 'pending');
        if (allData.referralSettings.enabled && referral) {
            const isNewCustomer = currentCustomer === null;
            if(!isNewCustomer) {
                setDiscountInfo({ applied: false, message: TRANSLATIONS.referralCodeInvalidNewCustomer, amount: 0, code: '' });
                return;
            }
            if (subtotal < allData.referralSettings.refereeMinPurchase) {
                 setDiscountInfo({ applied: false, message: TRANSLATIONS.referralCodeInvalidMinPurchase(formatCurrency(allData.referralSettings.refereeMinPurchase)), amount: 0, code: '' });
                return;
            }
            const discountAmount = allData.referralSettings.refereeDiscount;
            setDiscountInfo({ applied: true, message: TRANSLATIONS.referralDiscountApplied, amount: discountAmount, code: discountCode.toUpperCase()});
            return;
        }


        const code = allData.discountCodes.find(d => d.code === discountCode.toUpperCase() && d.isActive);
        if (code) {
            let amount = 0;
            if (code.type === 'fixed') {
                amount = code.value;
            } else {
                amount = subtotal * (code.value / 100);
            }
            setDiscountInfo({ applied: true, message: TRANSLATIONS.discountApplied, amount, code: code.code });
        } else {
            setDiscountInfo({ applied: false, message: TRANSLATIONS.invalidDiscountCode, amount: 0, code: '' });
        }
    };
    
    const total = Math.max(0, subtotal - discountInfo.amount);

    const handleCheckout = (customerData: {name: string, phone: string, address: string, birthDate: string}) => {
        if (!franchise) return;
        
        let updatedCustomers = [...allData.customers];
        const existingCustomerIndex = updatedCustomers.findIndex(c => c.id === customerData.phone);
        let redeemedRewardsForOrder: ReferralReward[] = [];
        
        if (existingCustomerIndex > -1) {
            const existingCustomer = updatedCustomers[existingCustomerIndex];
            if(appliedRewardIds.length > 0) {
                redeemedRewardsForOrder = existingCustomer.pendingRewards.filter(r => appliedRewardIds.includes(r.id));
            }
            
            updatedCustomers[existingCustomerIndex] = {
                ...existingCustomer,
                name: customerData.name,
                address: customerData.address,
                birthDate: customerData.birthDate,
                pendingRewards: existingCustomer.pendingRewards.filter(r => !appliedRewardIds.includes(r.id)),
            };

        } else {
            updatedCustomers.push({ id: customerData.phone, name: customerData.name, address: customerData.address, birthDate: customerData.birthDate, pendingRewards: [] });
        }

        const newOrder: StoreOrder = {
            id: `so-${Date.now()}`,
            franchiseId: franchise.id,
            customerId: customerData.phone,
            items: cart.map(i => ({ id: i.id, name: i.name, imageUrl: i.imageUrl, quantity: i.quantity, price: i.isReward ? 0 : i.price ?? 0 })),
            subtotal,
            discount: {
                code: discountInfo.code,
                amount: discountInfo.amount,
            },
            total,
            date: new Date().toISOString(),
            status: 'pending',
            redeemedRewards: redeemedRewardsForOrder,
        };

        const updatedFranchiseInventory = [...franchise.inventory];
        cart.forEach(cartItem => {
            const invItem = updatedFranchiseInventory.find(i => i.itemId === cartItem.id);
            if (invItem) {
                invItem.stock -= cartItem.quantity;
            }
        });
        
        let updatedReferrals = [...allData.referrals];
        
        const referral = allData.referrals.find(r => r.id === discountInfo.code && r.status === 'pending');
        if (referral) {
            referral.status = 'completed';
            referral.refereeId = customerData.phone;
            const referrer = updatedCustomers.find(c => c.id === referral.referrerId);
            if(referrer) {
                const rewardItem = allData.inventory.find(i => i.id === allData.referralSettings.referrerRewardItemId);
                if (rewardItem) {
                    const newReward: ReferralReward = {
                        id: `rew-${Date.now()}`,
                        description: `1 ${rewardItem.name} Gratis`,
                        itemId: rewardItem.id,
                    };
                    referrer.pendingRewards.push(newReward);
                }
            }
        }

        setAllData({
            ...allData,
            storeOrders: [...allData.storeOrders, newOrder],
            franchises: allData.franchises.map(f => f.id === franchise.id ? { ...f, inventory: updatedFranchiseInventory } : f),
            customers: updatedCustomers,
            referrals: updatedReferrals,
        });

        setLastOrder(newOrder);
        setShowCheckoutModal(false);
        setCart([]);
        setDiscountInfo({ applied: false, message: '', amount: 0, code:'' });
        setAppliedRewardIds([]);
        setCurrentCustomer(null);
    };

    const handleFindCustomer = (phone: string): Customer | null => {
        const customerIndex = allData.customers.findIndex(c => c.id === phone);

        if (customerIndex === -1) {
            setCurrentCustomer(null);
            return null;
        }

        let customer = allData.customers[customerIndex];
        const today = new Date();
        const currentYear = today.getFullYear();
        let wasUpdated = false;

        if (customer.birthDate && customer.lastBirthdayRewardYear !== currentYear) {
            const todayMMDD = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
            const birthMMDD = customer.birthDate.substring(5); // 'MM-DD'

            if (todayMMDD === birthMMDD) {
                const rewardItem = allData.inventory.find(i => i.id === allData.referralSettings.referrerRewardItemId);
                if (rewardItem) {
                    const newReward: ReferralReward = {
                        id: `bday-${Date.now()}`,
                        description: `¡Regalo de Cumpleaños! 1 ${rewardItem.name} Gratis`,
                        itemId: rewardItem.id,
                    };

                    const updatedCustomer = {
                        ...customer,
                        pendingRewards: [...customer.pendingRewards, newReward],
                        lastBirthdayRewardYear: currentYear,
                    };

                    const updatedCustomers = [...allData.customers];
                    updatedCustomers[customerIndex] = updatedCustomer;

                    setAllData({ ...allData, customers: updatedCustomers });
                    customer = updatedCustomer; // Use the updated customer object for the rest of the function
                    wasUpdated = true;
                }
            }
        }

        if (wasUpdated) {
            // Use a timeout to ensure the state update has propagated before showing the alert
            setTimeout(() => alert(TRANSLATIONS.happyBirthdayMessage), 100);
        }

        setCurrentCustomer(customer);
        return customer;
    };


    // Effect to auto-apply rewards
    useEffect(() => {
        if (!currentCustomer?.pendingRewards.length) return;

        const availableRewards = currentCustomer.pendingRewards.filter(r => !appliedRewardIds.includes(r.id));
        if (!availableRewards.length) return;

        const rewardToApply = availableRewards[0]; // Apply one reward at a time

        const targetCartItemIndex = cart.findIndex(item => item.id === rewardToApply.itemId && !item.isReward);

        if (targetCartItemIndex !== -1) {
            setCart(currentCart => {
                const newCart = [...currentCart];
                const targetItem = newCart[targetCartItemIndex];

                const rewardCartItem: CartItem = {
                    ...targetItem,
                    id: `${targetItem.id}-${rewardToApply.id}`, // Unique key for the reward item
                    isReward: true,
                    price: 0,
                    quantity: 1,
                };
                
                if (targetItem.quantity > 1) {
                    newCart[targetCartItemIndex] = { ...targetItem, quantity: targetItem.quantity - 1 };
                } else {
                    newCart.splice(targetCartItemIndex, 1);
                }

                newCart.push(rewardCartItem);
                return newCart;
            });

            setAppliedRewardIds(prev => [...prev, rewardToApply.id]);
            setDiscountInfo({applied: true, message: TRANSLATIONS.rewardApplied, amount: 0, code: ''});
        }
    }, [cart, currentCustomer, appliedRewardIds]);


    // Effect to un-apply reward if the free item is removed from the cart
    useEffect(() => {
        const currentlyApplied = cart.filter(i => i.isReward).map(i => i.id.split('-').pop()!);
        const removedRewardIds = appliedRewardIds.filter(id => !currentlyApplied.includes(id));
        if (removedRewardIds.length > 0) {
            setAppliedRewardIds(ids => ids.filter(id => !removedRewardIds.includes(id)));
        }
    }, [cart]);


    if (!franchise) return <StoreNotFoundPage onBack={onClose} />;
    
    if(lastOrder) {
        return <CheckoutSuccess order={lastOrder} customer={allData.customers.find(c => c.id === lastOrder.customerId)!} franchise={franchise} onContinue={() => setLastOrder(null)} allData={allData} setAllData={setAllData} />
    }
    
    return (
        <div className="public-store-page">
             {isCartOpen && <div className="backdrop" onClick={() => setIsCartOpen(false)} style={{zIndex: 1199}}></div>}
            <header className="store-header">
                <h1>{franchise.storeSettings.storeName}</h1>
            </header>
            <main className="store-content">
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                {product.stock <= 0 && <span className="stock-badge">{TRANSLATIONS.outOfStock}</span>}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">{formatCurrency(product.price ?? 0)}</p>
                            </div>
                             <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
                                {product.stock > 0 ? TRANSLATIONS.addToCart : TRANSLATIONS.outOfStock}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {cart.length > 0 && (
                <button className="cart-fab" onClick={() => setIsCartOpen(true)}>
                    <ICONS.ShoppingCart />
                    <span className="cart-item-count">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </button>
            )}
            
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                 <div className="cart-header">
                    <h3>{TRANSLATIONS.shoppingCart}</h3>
                    <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}><ICONS.Close /></button>
                </div>
                 <div className="cart-body">
                    {cart.length === 0 ? <p className="empty-state">{TRANSLATIONS.yourCartIsEmpty}</p> : 
                        cart.map(item => (
                            <div key={item.id} className={`cart-item ${item.isReward ? 'reward' : ''}`}>
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-price">{item.isReward ? TRANSLATIONS.free : formatCurrency(item.price ?? 0)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    {!item.isReward ? (
                                        <div className="quantity-control">
                                            <button className="quantity-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}><ICONS.Minus/></button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button className="quantity-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}><ICONS.Plus/></button>
                                        </div>
                                    ) : (
                                        <button className="delete-item-btn" onClick={() => updateCartQuantity(item.id, 0)}><ICONS.Delete/></button>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="cart-footer">
                    <div className="discount-form">
                        <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder={TRANSLATIONS.discountCodePlaceholder} />
                        <button onClick={handleApplyDiscount}>{TRANSLATIONS.apply}</button>
                    </div>
                    {discountInfo.message && <p className={`discount-message ${discountInfo.applied ? 'success' : 'error'}`}>{discountInfo.message}</p>}
                    <div className="cart-summary">
                        <div className="summary-item">
                            <span>{TRANSLATIONS.subtotal}</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {discountInfo.applied && discountInfo.amount > 0 &&
                             <div className="summary-item">
                                <span>{TRANSLATIONS.discountApplied}</span>
                                <span>-{formatCurrency(discountInfo.amount)}</span>
                            </div>
                        }
                        <div className="summary-item total">
                            <span>{TRANSLATIONS.total}</span>
                            <strong>{formatCurrency(total)}</strong>
                        </div>
                    </div>
                    <button className="submit-btn checkout-btn" onClick={() => setShowCheckoutModal(true)}>{TRANSLATIONS.checkout}</button>
                </div>
            </div>

            {showCheckoutModal && 
                <CheckoutModal 
                    onClose={() => setShowCheckoutModal(false)} 
                    onCheckout={handleCheckout} 
                    onFindCustomer={handleFindCustomer}
                    customer={currentCustomer}
                />
            }
        </div>
    );
};

const CheckoutModal = ({ onClose, onCheckout, onFindCustomer, customer }: { onClose: () => void, onCheckout: (d: any) => void, onFindCustomer: (phone: string) => Customer | null, customer: Customer | null }) => {
    const [name, setName] = useState(customer?.name ?? '');
    const [phone, setPhone] = useState(customer?.id ?? '');
    const [address, setAddress] = useState(customer?.address ?? '');
    const [birthDate, setBirthDate] = useState(customer?.birthDate ?? '');
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const handlePhoneBlur = () => {
        if(phone) {
            const foundCustomer = onFindCustomer(phone);
            if(foundCustomer) {
                setName(foundCustomer.name);
                setAddress(foundCustomer.address);
                setBirthDate(foundCustomer.birthDate || '');
                setWelcomeMessage(TRANSLATIONS.welcomeBack.replace('{name}', foundCustomer.name.split(' ')[0]));
            } else {
                 setWelcomeMessage('');
            }
        }
    }

    const handleSubmit = () => {
        if (name && phone && address) {
            onCheckout({ name, phone, address, birthDate });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}><ICONS.Close/></button>
                <h3>{TRANSLATIONS.completeYourData}</h3>
                <div className="form-grid checkout-form" style={{gridTemplateColumns: '1fr'}}>
                    {welcomeMessage && <p className="success-message">{welcomeMessage}</p>}
                     <div className="form-group">
                        <label>{TRANSLATIONS.phone}</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} onBlur={handlePhoneBlur}/>
                    </div>
                    <div className="form-group">
                        <label>{TRANSLATIONS.name}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>{TRANSLATIONS.address}</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>{TRANSLATIONS.birthDate}</label>
                        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}/>
                    </div>
                    <button className="submit-btn" onClick={handleSubmit}>{TRANSLATIONS.confirmOrder}</button>
                </div>
            </div>
        </div>
    );
};

const CheckoutSuccess = ({ order, customer, franchise, onContinue, allData, setAllData }: { order: StoreOrder, customer: Customer, franchise: Franchise, onContinue: () => void, allData: AppData, setAllData: (d: AppData) => void }) => {
    const [referralCode, setReferralCode] = useState<string | null>(null);

    const generateReferralCode = () => {
        const newReferral: Referral = {
            id: `REF${Date.now()}`.slice(-8),
            referrerId: customer.id,
            refereeId: '', // To be filled when used
            date: new Date().toISOString(),
            status: 'pending'
        };
        setAllData({ ...allData, referrals: [...allData.referrals, newReferral] });
        setReferralCode(newReferral.id);
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(TRANSLATIONS.codeCopied);
    };

    const handleWhatsAppShare = (code: string) => {
        const text = `¡Te regalo un descuento de ${formatCurrency(allData.referralSettings.refereeDiscount)} en ${franchise.storeSettings.storeName}! Usa mi código ${code} en tu primera compra. ¡Aprovecha!`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const whatsappMessage = `¡Hola ${franchise.storeSettings.storeName}! Quiero confirmar mi pedido #${order.id}. Detalles:\n${order.items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\nTotal: ${formatCurrency(order.total)}\nMi nombre es ${customer.name} y mi dirección es ${customer.address}. ¡Gracias!`;
    return (
        <div className="store-not-found-page">
            <h1>{TRANSLATIONS.orderSuccessful}</h1>
            <p>{TRANSLATIONS.weWillContactYou}</p>
            <a href={`https://wa.me/${franchise.storeSettings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" className="submit-btn whatsapp-btn">
                <ICONS.WhatsApp />
                {TRANSLATIONS.confirmOrderViaWhatsApp}
            </a>
            
            {allData.referralSettings.enabled && (
                <div className="referral-generation-box">
                    <h4>{TRANSLATIONS.shareAndWin}</h4>
                    {referralCode ? (
                        <>
                           <p>{TRANSLATIONS.yourReferralCode}</p>
                            <div className="referral-code-display">
                                <span>{referralCode}</span>
                                <button onClick={() => handleCopy(referralCode)}><ICONS.Copy /></button>
                            </div>
                           <button className="submit-btn whatsapp-btn" onClick={() => handleWhatsAppShare(referralCode)}>
                                <ICONS.WhatsApp />
                                {TRANSLATIONS.shareOnWhatsApp}
                           </button>
                        </>
                    ) : (
                         <button className="submit-btn" onClick={generateReferralCode}>{TRANSLATIONS.generateMyCode}</button>
                    )}
                </div>
            )}


            <button className="store-link" style={{marginTop: '2rem'}} onClick={onContinue}>{TRANSLATIONS.continueShopping}</button>
        </div>
    );
};


const StoreNotFoundPage = ({ onBack }: { onBack: () => void }) => (
    <div className="store-not-found-page">
        <h1>404</h1>
        <p>Tienda no encontrada o no habilitada.</p>
        <button className="submit-btn" onClick={onBack}>Volver</button>
    </div>
);

const UsersView = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('franchise-manager');
    const [franchiseId, setFranchiseId] = useState('');

    useEffect(() => {
        if (role === 'franchise-manager' && data.franchises.length > 0 && !franchiseId) {
            setFranchiseId(data.franchises[0].id);
        }
    }, [role, data.franchises, franchiseId]);

    const handleAddUser = () => {
        if (!name || !username || !password) {
            alert(TRANSLATIONS.pleaseFillInAllFields);
            return;
        }
        if (role === 'franchise-manager' && !franchiseId) {
            alert(TRANSLATIONS.pleaseFillInAllFields);
            return;
        }

        const newUser: User = {
            id: `user${Date.now()}`,
            name,
            username,
            password,
            role,
            franchiseId: role === 'franchise-manager' ? franchiseId : undefined,
        };

        setData({ ...data, users: [...data.users, newUser] });
        alert(TRANSLATIONS.userCreatedSuccessfully);
        // Reset form
        setName('');
        setUsername('');
        setPassword('');
    };
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm(TRANSLATIONS.confirmDeleteUser)) {
             setData({ ...data, users: data.users.filter(u => u.id !== userId) });
        }
    }

    return (
        <div className="users-view">
            <div className="card">
                <h3 className="card-header">{TRANSLATIONS.addUser}</h3>
                <div className="form-grid">
                    <div className="form-group"><label>{TRANSLATIONS.name}</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="form-group"><label>{TRANSLATIONS.Username}</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} /></div>
                    <div className="form-group"><label>{TRANSLATIONS.Password}</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                    <div className="form-group">
                        <label>{TRANSLATIONS.role}</label>
                        <select value={role} onChange={e => setRole(e.target.value as UserRole)}>
                            <option value="super-admin">{TRANSLATIONS.superAdmin}</option>
                            <option value="franchise-manager">{TRANSLATIONS.franchiseManager}</option>
                        </select>
                    </div>
                    {role === 'franchise-manager' && (
                        <div className="form-group">
                            <label>{TRANSLATIONS.selectFranchise}</label>
                            <select value={franchiseId} onChange={e => setFranchiseId(e.target.value)} disabled={data.franchises.length === 0}>
                                {data.franchises.length > 0 ? (
                                    data.franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)
                                ) : (
                                    <option value="">{TRANSLATIONS.noFranchisesAdded}</option>
                                )}
                            </select>
                        </div>
                    )}
                     <div className="form-group form-group-submit">
                         <button className="submit-btn" onClick={handleAddUser}>{TRANSLATIONS.addUser}</button>
                    </div>
                </div>
            </div>
            <div className="card">
                <h3 className="card-header">{TRANSLATIONS.userManagement}</h3>
                 <div className="table-container">
                    <table className="operators-table">
                        <thead>
                            <tr>
                                <th>{TRANSLATIONS.name}</th>
                                <th>{TRANSLATIONS.Username}</th>
                                <th>{TRANSLATIONS.role}</th>
                                <th>{TRANSLATIONS.franchise}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role === 'super-admin' ? TRANSLATIONS.superAdmin : TRANSLATIONS.franchiseManager}</td>
                                    <td>{user.franchiseId ? data.franchises.find(f => f.id === user.franchiseId)?.name : 'N/A'}</td>
                                    <td>
                                        <button className="table-action-btn delete" onClick={() => handleDeleteUser(user.id)} title={TRANSLATIONS.delete}>
                                            <ICONS.Delete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FranchiseRequestView = ({ data, setData, currentUser }: { data: AppData, setData: (d: AppData) => void, currentUser: User }) => {
    const [requestItems, setRequestItems] = useState<DispatchItem[]>([]);
    const [viewOrderModal, setViewOrderModal] = useState<FranchiseOrder | null>(null);
    
    const availableItems = useMemo(() => {
        return data.inventory
            .filter(i => i.isSellable && i.franchisePrice !== undefined && i.franchisePrice > 0)
            .map(i => {
                const producibleBase = data.producibleItems.find(p => p.id === i.id) || {};
                return {
                    ...producibleBase,
                    ...i,
                    price: i.franchisePrice!,
                } as ProducibleItem;
            });
    }, [data.inventory, data.producibleItems]);

    const handleDuplicateRequest = (orderToCopy: FranchiseOrder) => {
        for (const item of orderToCopy.items) {
            const stockItem = data.inventory.find(i => i.id === item.itemId);
            if (!stockItem || stockItem.stock < item.quantity) {
                 alert(`No hay suficiente stock de "${stockItem?.name || 'un artículo'}" para duplicar el pedido. Se necesitan ${item.quantity} y solo hay ${stockItem?.stock ?? 0} disponibles.`);
                return;
            }
        }
        setRequestItems(orderToCopy.items);
        window.scrollTo(0, 0);
    };

    const handleAddItem = (item: ProducibleItem, quantity: number) => {
        const existingItem = requestItems.find(i => i.itemId === item.id);
        const currentStock = item.stock;
        const quantityInCart = existingItem?.quantity ?? 0;

        if (quantity > currentStock - quantityInCart) {
            alert(TRANSLATIONS.alertCannotAddStock(quantity, currentStock - quantityInCart));
            return;
        }

        if (existingItem) {
            setRequestItems(requestItems.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i));
        } else {
            setRequestItems([...requestItems, { itemId: item.id, quantity, price: item.price }]);
        }
    };
    
    const updateItemInRequest = (itemId: string, newQuantity: number) => {
        const itemInStock = availableItems.find(i => i.id === itemId);
        if (!itemInStock) return;
        
        if (newQuantity > itemInStock.stock) {
            newQuantity = itemInStock.stock;
            alert(TRANSLATIONS.alertWarningStock(itemInStock.stock, itemInStock.name));
        }
        if (newQuantity <= 0) {
            setRequestItems(requestItems.filter(i => i.itemId !== itemId));
        } else {
            setRequestItems(requestItems.map(i => i.itemId === itemId ? { ...i, quantity: newQuantity } : i));
        }
    };

    const handleSendRequest = () => {
        if (requestItems.length === 0) return;
        
        const newOrder: FranchiseOrder = {
            id: `fo${Date.now()}`,
            franchiseId: currentUser.franchiseId!,
            items: requestItems,
            date: new Date().toISOString(),
            type: 'sale', // Default, admin can change on approval
            status: 'request-pending',
        };
        
        setData({ ...data, franchiseOrders: [newOrder, ...data.franchiseOrders] });
        setRequestItems([]);
        alert(TRANSLATIONS.requestSentSuccessfully);
    };
    
    const franchiseOrders = useMemo(() => {
        return data.franchiseOrders.filter(o => o.franchiseId === currentUser.franchiseId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [data.franchiseOrders, currentUser.franchiseId]);
    
    return (
        <div className="franchise-requests-view">
             <div className="card">
                <h3 className="card-header">{TRANSLATIONS.createNewRequest}</h3>
                
                <AddItemToDispatchForm dispatchableItems={availableItems} onAddItem={handleAddItem} />

                {requestItems.length === 0 ? (
                     <p className="empty-state">{TRANSLATIONS.noItemsToTransfer}</p>
                ) : (
                    <div className="dispatch-item-editor-list">
                        <div className="dispatch-item-editor-header">
                           <span>{TRANSLATIONS.item}</span>
                           <span>{TRANSLATIONS.quantity}</span>
                           <span>{TRANSLATIONS.mainStock}</span>
                           <span></span>
                        </div>
                        {requestItems.map(item => {
                            const inventoryItem = data.inventory.find(i => i.id === item.itemId);
                            return (
                                <div key={item.itemId} className="dispatch-item-editor-row">
                                    <span className="item-name">{inventoryItem?.name ?? TRANSLATIONS.unknownItem}</span>
                                    <input
                                        type="number"
                                        className="item-input"
                                        value={item.quantity}
                                        onChange={(e) => updateItemInRequest(item.itemId, parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <span>{inventoryItem?.stock ?? 0}</span>
                                    <button className="delete-item-btn" onClick={() => updateItemInRequest(item.itemId, 0)}>
                                        <ICONS.Delete />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <button className="submit-btn" onClick={handleSendRequest} disabled={requestItems.length === 0}>
                    {TRANSLATIONS.sendRequest}
                </button>
            </div>
            <div className="card">
                <h3 className="card-header">{TRANSLATIONS.requestHistory}</h3>
                <div className="table-container">
                    <table className="dispatch-table">
                        <thead>
                             <tr>
                                <th>{TRANSLATIONS.date}</th>
                                <th>{TRANSLATIONS.items}</th>
                                <th>{TRANSLATIONS.totalValue}</th>
                                <th>{TRANSLATIONS.status}</th>
                                <th>{TRANSLATIONS.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                             {franchiseOrders.length === 0 ? (
                                <tr><td colSpan={5} className="empty-state">{TRANSLATIONS.noRequestsMade}</td></tr>
                            ) : (
                                franchiseOrders.map(order => {
                                    const totalValue = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                    const statusInfo = getFranchiseOrderStatusInfo(order.status);
                                    return (
                                    <tr key={order.id}>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>{order.items.length}</td>
                                        <td>{formatCurrency(totalValue)}</td>
                                        <td><span className={`status-badge ${order.status.replace(/-/g, '')}`}>{statusInfo.text}</span></td>
                                        <td className="table-actions">
                                            <button className="table-action-btn view" onClick={() => setViewOrderModal(order)}>
                                                {TRANSLATIONS.viewDetails}
                                            </button>
                                            <button className="table-action-btn copy" onClick={() => handleDuplicateRequest(order)} title={TRANSLATIONS.duplicateOrder}>
                                                <ICONS.Copy />
                                            </button>
                                        </td>
                                    </tr>
                                )})
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {viewOrderModal && <FranchiseRequestDetailsModal order={viewOrderModal} data={data} onClose={() => setViewOrderModal(null)} />}
        </div>
    );
};

const App = () => {
    const [view, setView] = useState<View>('Analytics');
    const [data, setData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [context, setContext] = useState('main'); // 'main' or franchiseId
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'admin' | 'store'>('admin');
    const [franchiseIdForStore, setFranchiseIdForStore] = useState<string | null>(null);


    useEffect(() => {
        try {
            const savedData = localStorage.getItem('vendigo-data');
            if (savedData) {
                setData(JSON.parse(savedData));
            } else {
                setData(initialData);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setData(initialData);
        }
        
        const savedUser = localStorage.getItem('vendigo-currentUser');
        if (savedUser) {
            try {
                setCurrentUser(JSON.parse(savedUser));
            } catch (e) {
                 localStorage.removeItem('vendigo-currentUser');
            }
        }
        setTimeout(() => setLoading(false), 1000);
    }, []);

    useEffect(() => {
        if (data) {
            try {
                localStorage.setItem('vendigo-data', JSON.stringify(data));
                if (currentUser && !data.users.some(u => u.id === currentUser.id)) {
                    // Log out user if they have been deleted
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Failed to save data to localStorage", error);
            }
        }
        if (currentUser) {
            localStorage.setItem('vendigo-currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('vendigo-currentUser');
        }
    }, [data, currentUser]);
    
    const handlePreviewStore = useCallback((franchiseId: string) => {
        setFranchiseIdForStore(franchiseId);
        setViewMode('store');
    }, []);

    const handleSetData = (newData: AppData) => {
        setData(newData);
    };

    const handleSetView = (newView: View) => {
        setView(newView);
        if (window.innerWidth <= 992) {
            setIsSidebarOpen(false);
        }
    };

    const handleLogin = (username: string, password: string): boolean => {
        if (!data) return false;
        const user = data.users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            if (user.role === 'franchise-manager') {
                setContext(user.franchiseId!);
                handleSetView('Requests');
            } else {
                setContext('main');
                handleSetView('Analytics');
            }
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setContext('main');
        handleSetView('Analytics'); // Reset view state
    };

    const renderView = () => {
        if (!data) return null;
        switch (view) {
            case 'Analytics': return <AnalyticsView data={data} />;
            case 'Production': return <ProductionView data={data} setData={handleSetData} />;
            case 'Inventory': return <InventoryView data={data} setData={handleSetData} context={context} />;
            case 'Operators': return <OperatorsView data={data} setData={handleSetData} context={context} />;
            case 'Dispatch': return <DispatchView data={data} setData={handleSetData} context={context} />;
            case 'Franchises': return <FranchisesView data={data} setData={handleSetData} />;
            case 'Store': return <StoreManagementView data={data} setData={handleSetData} onPreviewStore={handlePreviewStore} currentUser={currentUser!} />;
            case 'Users': return <UsersView data={data} setData={handleSetData} />;
            case 'Requests': return <FranchiseRequestView data={data} setData={handleSetData} currentUser={currentUser!} />;
            default: return <div className="placeholder"><h2>{view}</h2><p>{TRANSLATIONS.selectAView}</p></div>;
        }
    };
    
    if (loading) {
        return <LoadingScreen />;
    }

    if (viewMode === 'store' && franchiseIdForStore) {
        const franchise = data?.franchises.find(f => f.id === franchiseIdForStore);
        const handleCloseStore = () => {
            setFranchiseIdForStore(null);
            setViewMode('admin');
        };
        if (franchise && franchise.storeSettings.isEnabled) {
            return <PublicStorePage franchiseId={franchiseIdForStore} allData={data!} setAllData={handleSetData} onClose={handleCloseStore} />;
        }
        return <StoreNotFoundPage onBack={handleCloseStore} />;
    }
    
    if (!currentUser || !data) {
        return <LoginView onLogin={handleLogin} />;
    }

    const isFranchiseManager = currentUser.role === 'franchise-manager';
    const isFranchiseContext = context !== 'main';
    const allowedManagerViews: View[] = ['Dispatch', 'Operators', 'Inventory', 'Requests', 'Store'];

    let canView = true;
    if (isFranchiseManager && !allowedManagerViews.includes(view)) {
        canView = false;
    }
    if (!isFranchiseManager && isFranchiseContext && !allowedManagerViews.includes(view) && view !== 'Analytics') {
        canView = false;
    }
     if (view === 'Users' && isFranchiseManager) {
        canView = false;
    }
    

    return (
        <div className="app-container">
            {isSidebarOpen && <div className="backdrop" onClick={() => setIsSidebarOpen(false)}></div>}
            <Sidebar 
                activeView={view} 
                setView={handleSetView} 
                data={data}
                context={context}
                setContext={setContext}
                currentUser={currentUser}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                closeSidebar={() => setIsSidebarOpen(false)}
            />
            <main className="main-content">
                <header className="main-header">
                    <button className="hamburger-menu" onClick={() => setIsSidebarOpen(true)}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h2>{isFranchiseManager ? TRANSLATIONS[view] : (view === 'Store' ? TRANSLATIONS.storeManagement : TRANSLATIONS[view])}</h2>
                </header>
                {canView ? renderView() : (
                    <div className="placeholder">{TRANSLATIONS.notAuthorized}</div>
                )}
            </main>
        </div>
    );
};

const Sidebar = ({ activeView, setView, data, context, setContext, currentUser, onLogout, isOpen, closeSidebar }: { activeView: View, setView: (v: View) => void, data: AppData, context: string, setContext: (c: string) => void, currentUser: User, onLogout: () => void, isOpen: boolean, closeSidebar: () => void }) => {
    
    const baseNavLinks: { view: View, label: keyof typeof TRANSLATIONS, icon: keyof typeof ICONS }[] = [
        { view: 'Analytics', label: 'Analytics', icon: 'Analytics' },
        { view: 'Dispatch', label: 'Dispatch', icon: 'Dispatch' },
        { view: 'Production', label: 'Production', icon: 'Production' },
        { view: 'Inventory', label: 'Inventory', icon: 'Inventory' },
        { view: 'Operators', label: 'Operators', icon: 'Operators' },
        { view: 'Franchises', label: 'Franchises', icon: 'Franchises' },
        { view: 'Store', label: 'Store', icon: 'Store' },
    ];

    const availableLinks = useMemo<Array<{ view: View, label: keyof typeof TRANSLATIONS, icon: keyof typeof ICONS }>>(() => {
        if (currentUser.role === 'super-admin') {
            return [...baseNavLinks, { view: 'Users', label: 'Users', icon: 'Operators' }];
        }
        if (currentUser.role === 'franchise-manager') {
            const managerLinks: { view: View, label: keyof typeof TRANSLATIONS, icon: keyof typeof ICONS }[] = [
                { view: 'Requests', label: 'Requests', icon: 'Requests' },
                { view: 'Store', label: 'Store', icon: 'Store' },
                { view: 'Dispatch', label: 'Dispatch', icon: 'Dispatch' },
                { view: 'Inventory', label: 'Inventory', icon: 'Inventory' },
                { view: 'Operators', label: 'Operators', icon: 'Operators' },
            ];
            return managerLinks;
        }
        return [];
    }, [currentUser.role]);
    
    const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newContext = e.target.value;
        setContext(newContext);
        
        if (newContext === 'main') {
            setView('Analytics');
        } else {
            setView('Dispatch');
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div>
                 <div className="sidebar-header">
                    <span className="logo"><ICONS.Store /></span>
                    <h1>Vendigo</h1>
                     <button className="sidebar-close-btn" onClick={closeSidebar}><ICONS.Close /></button>
                </div>
                <div className="context-switcher">
                    <label htmlFor="context-select">{TRANSLATIONS.selectContext}</label>
                    <select id="context-select" value={context} onChange={handleContextChange} disabled={currentUser.role === 'franchise-manager'}>
                        <option value="main">{TRANSLATIONS.mainBusiness}</option>
                        {data.franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <nav>
                    <ul className="nav-links">
                        {availableLinks.map(link => {
                            const Icon = ICONS[link.icon];
                            return (
                                <li key={link.view}>
                                    <button
                                        className={`nav-link ${activeView === link.view ? 'active' : ''}`}
                                        onClick={() => setView(link.view)}
                                    >
                                        <Icon />
                                        <span>{TRANSLATIONS[link.label] as string}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <span className="user-profile-name">{currentUser.name}</span>
                    <span className="user-profile-role">{currentUser.role === 'super-admin' ? TRANSLATIONS.superAdmin : TRANSLATIONS.franchiseManager}</span>
                </div>
                <button className="logout-btn" onClick={onLogout} title={TRANSLATIONS.Logout}>
                    <ICONS.Logout />
                </button>
            </div>
        </aside>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
