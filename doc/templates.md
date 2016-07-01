Templates
=========

* [Letter](#letter)
* [Invoice](#invoice)
* [Report](#report)


## Letter

The "Letter" template helps you write (formal) letters, usually to print and
send my mail.

### YAML Front-Matter

```yaml
---
date:
location:
addressFrom:
  name:
  street:
  zipCode:
  city:
addressTo:
  name:
  street:
  zipCode:
  city:
signature:
---
```

## Invoice

The "Invoice" template helps you write invoices.

### YAML Front-Matter

```yaml
---
reference:
date:
amount:
companyAddress:
  name:
  street:
  zipCode:
  city:
  country:
  businessID:
customerAddress:
  name:
  street:
  zipCode:
  city:
  country:
  businessID:
---
```

## Report

The "Report" template helps you write reports.

### YAML Front-Matter

```yaml
---
company:
  name:
  logo_url:
project:
reporter:
date:
location:
reference:
version:
---
```

---
Back to: [Writing Monod documents](writing.md)
