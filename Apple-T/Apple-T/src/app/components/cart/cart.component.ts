import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helper/ValidateForm';
import { ApiCartService } from 'src/app/services/api-cart.service';
import { ApiOrderService } from 'src/app/services/api-order.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  public lstCart : any = [];
  fullname:string = '';
  cartID:number = 0;
  total:number = 0;
  path:string = '';
  qtyCart = 0;
  amount = 0;
  protQty = 1;
  paymentMethod: string = 'Cash on Delivery';
  payment: boolean = false;

  selectedPaymentMethod: string = '';
  // shippingType:string = '5';

  sum : string = "";

  orderForm!:FormGroup

  @ViewChild('exampleModal') modal : any;
  @ViewChild('paymentRef', {static:true}) paymentRef!: ElementRef;
  @ViewChild('exampleModal2') modal2: any;

  constructor(
    private userStore:UserStoreService,
    private api:ApiService,
    private apiCart:ApiCartService,
    private apiProduct:ApiProductService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private apiOrder: ApiOrderService,
    private router:Router,
  ){}


  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.api.getUserId(this.fullname).subscribe(data => {
      this.cartID = data;
      this.getCart(this.cartID);
      this.path = this.apiProduct.PhotoUrl + "/";
    });

    this.orderForm = this.fb.group({
      order_address: ['', Validators.required],
      order_phone: ['', [Validators.required, Validators.pattern('^[0]\\d{9}$')]],
      order_payment: ['',Validators.required],
      order_note: [''],
      order_total_price: ['']
    })

    
    // this.cashOnBank();
  }

  // onSelectShipType(event:any){
  //   this.shippingType = event.target.value;
  // }

  onPaymentMethodChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const paymentMethod = target.value;
    this.selectedPaymentMethod = paymentMethod;
  }

  cashOnBank(){
    this.amount = this.total;

    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.total,
                  currency_code: 'USD'
                }
              }
            ]
          })
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            if (details.status === 'COMPLETED'){
              this.sum = (this.total).toString();
              const obj = {
                order_address : this.orderForm.get('order_address')?.value,
                order_note : this.orderForm.get('order_note')?.value,
                order_payment : this.orderForm.get('order_payment')?.value,
                order_phone : this.orderForm.get('order_phone')?.value,
                order_total_price : this.sum
              }

              this.apiOrder.addOrder(this.lstCart, obj).subscribe(res => {
                this.toast.success(res.message, 'Success', {
                  timeOut: 1500,
                  progressBar: true,
                  positionClass: 'toast-top-center'
                });
                this.orderForm.reset();
                setTimeout(() => {
                  window.location.reload();
              }, 3000);

              },
              error => {
                this.toast.error(error.error.message, 'Error', {
                  timeOut: 1500,
                  progressBar: true,
                  positionClass: 'toast-top-center'
                });
              })
            }
          })
        }
      }
    ).render(this.paymentRef.nativeElement);
  }

  getCart(id:number){
    this.apiCart.getCart(id).subscribe(data => {
      this.lstCart = data.ds;
      this.total = data.total;
      this.qtyCart = this.lstCart.length;
    })
  }

  plusQty(id:number){
    this.apiCart.plusQty(id).subscribe(res => {
      this.getCart(this.cartID);
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });

  }

  minusQty(id:number){
    this.apiCart.minusQty(id).subscribe(res => {
      this.getCart(this.cartID);
    });
  }

  deletecart(id:number){
    this.apiCart.deleteCart(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getCart(this.cartID);
      this.modal.nativeElement.dismiss();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  addOrder(){
    if(this.orderForm.valid){
      this.sum = (this.total).toString();
      // console.log(this.sum);
      const obj = {
        order_address : this.orderForm.get('order_address')?.value,
        order_note : this.orderForm.get('order_note')?.value,
        order_payment : this.orderForm.get('order_payment')?.value,
        order_phone : this.orderForm.get('order_phone')?.value,
        order_total_price : this.sum
      }

      this.apiOrder.addOrder(this.lstCart, obj).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
        this.orderForm.reset();
        setTimeout(() => {
          window.location.reload();
      }, 3000);

      },
      error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      })
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.orderForm);
      this.toast.warning("Please enter required field to order!!!", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }

  // onSelectPayment(event:any){
  //   this.paymentMethod = event.target.selectedOptions[0].value;
  //   if(this.paymentMethod === 'Cash on Banking'){
  //     this.payment = true;
  //   }

  //   if(this.paymentMethod === 'Cash on Delivery'){
  //     this.payment = false;
  //   }
  // }
}
