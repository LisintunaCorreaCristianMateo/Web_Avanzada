"""Paquete clients: modelos, lógica y router.

No importamos submódulos aquí para evitar importaciones circulares
cuando `main` hace `from clients.router import ...`.
"""

__all__ = ["models", "crud", "router"]
