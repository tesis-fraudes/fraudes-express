"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralNetwork = void 0;
const typeorm_1 = require("typeorm");
let NeuralNetwork = class NeuralNetwork {
};
exports.NeuralNetwork = NeuralNetwork;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NeuralNetwork.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_file' }),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "urlFile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], NeuralNetwork.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NeuralNetwork.prototype, "createAt", void 0);
exports.NeuralNetwork = NeuralNetwork = __decorate([
    (0, typeorm_1.Entity)('tbl_neuralnetwork')
], NeuralNetwork);
