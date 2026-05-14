# 11 Design Patterns

## 1. Adapter Pattern
- **Application**: Payment Gateways, Insurance APIs.
- **Problem**: System needs to support multiple payment providers without changing core billing logic.
- **Implementation**: `PaymentAdapter` interface with implementations like `StripeAdapter`, `PayPalAdapter`.

## 2. Bridge Pattern
- **Application**: Notification System.
- **Problem**: Decoupling the notification type (Appointment Reminder, Bill Alert) from the delivery method (SMS, Email).
- **Implementation**: `Notification` abstraction and `MessageSender` implementation hierarchy.

## 3. Factory Method Pattern
- **Application**: User/Role Creation.
- **Problem**: Constructing different user types (Doctor vs. Patient) with specific initializations.
- **Implementation**: `UserFactory` with methods like `createDoctor()`, `createPatient()`.

## 4. Abstract Factory Pattern
- **Application**: Service Families (e.g., Regional Billing Rules).
- **Problem**: Providing families of related objects (Tax Calculators, Invoice Formatters) for different hospital locations.
- **Implementation**: `BillingSystemFactory` providing `TaxCalculator` and `InvoiceGenerator`.

## 5. Builder Pattern
- **Application**: Complex Records (Patient Records, Medical Reports).
- **Problem**: Objects with many optional fields and complex construction steps.
- **Implementation**: `MedicalReportBuilder` with fluent methods like `addDiagnosis()`, `addPrescription()`, `addLabResult()`.

## Enterprise Benefits
- **Flexibility**: New providers or types can be added with minimal code changes.
- **Testability**: Interfaces allow for clean unit testing with mocks.
- **Readability**: Complex construction logic is moved out of business services.
